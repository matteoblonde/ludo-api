import { Inject } from '@nestjs/common';
import axios from 'axios';
import PdfPrinter from 'pdfmake';
import company from '../../database/models/Company/Company';
import CompanyModel from '../../database/models/Company/Company';
import MatchModel from '../../database/models/Match/Match';
import PlayerModel from '../../database/models/Player/Player';
import player from '../../database/models/Player/Player';
import SeasonModel from '../../database/models/Season/Season';
import TeamModel from '../../database/models/Team/Team';
import TrainingModel from '../../database/models/Training/Training';
import { dateConverter, dateTimeConverter } from '../../utils/date/date-converter';
import { IUserData } from '../auth/interfaces/UserData';


export class PrinterService {

  constructor(
    @Inject(MatchModel.collection.name)
    private readonly matchModel: typeof MatchModel,
    @Inject(CompanyModel.collection.name)
    private readonly companyModel: typeof CompanyModel,
    @Inject(TrainingModel.collection.name)
    private readonly trainingModel: typeof TrainingModel,
    @Inject(TeamModel.collection.name)
    private readonly teamModel: typeof TeamModel,
    @Inject(PlayerModel.collection.name)
    private readonly playerModel: typeof PlayerModel,
    @Inject(SeasonModel.collection.name)
    private readonly seasonModel: typeof SeasonModel
  ) {
  }


  /**
   * Retrieves an image from the specified URL and returns it as a base64-encoded string.
   *
   * @param {string} url - The URL of the image to retrieve.
   * @return {Promise<string>} - A promise that resolves with the base64-encoded image string. If there is an error, an empty string is returned.
   */
  async getImageAsBase64(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer'
      });
      const buffer = Buffer.from(response.data, 'binary');
      return buffer.toString('base64');
    }
    catch (error) {
      return '';
    }
  }


  /**
   * Retrieve an image from a given URL and convert it to a base64 image
   *
   * @param {any} url - The URL of the image
   * @return {Promise<string>} - A promise that resolves with the base64 image
   */
  async getImage(url: any): Promise<any> {
    let image;
    await this.getImageAsBase64(url).then(base64Image => {
      image = 'data:image/jpeg;base64,' + base64Image;
    });
    return image;
  };


  /**
   * Creates a PDF document using the given docDefinition.
   *
   * @param {any} docDefinition - The document definition object.
   * @return {Promise<Buffer>} - A promise that resolves with a Buffer containing the PDF document.
   */
  createPdfDoc(docDefinition: any): Promise<Buffer> {
    /** Build the PDF */
    return new Promise((resolve, reject) => {

      /** Set the fonts */
      const fonts = {
        Roboto: {
          normal     : 'src/utils/fonts/Roboto/Roboto-Regular.ttf',
          bold       : 'src/utils/fonts/Roboto/Roboto-Medium.ttf',
          italics    : 'src/utils/fonts/Roboto/Roboto-Italic.ttf',
          bolditalics: 'src/utils/fonts/Roboto/Roboto-MediumItalic.ttf'
        }
      };

      /** Initialize the printer */
      const printer = new PdfPrinter(fonts);

      /** Compile the doc and resolve */
      const pdfDoc = printer.createPdfKitDocument(docDefinition as any);
      const chunks: any = [];

      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => {
        /** Resolve */
        resolve(Buffer.concat(chunks));
      });
      pdfDoc.on('error', (err) => {
        /** If some error occurred */
        reject(err);
      });

      pdfDoc.end();
    });
  }


  /**
   * Generates a PDF for a match convocation.
   *
   * @param {string} matchId - The ID of the match.
   * @param {string} companyId - The ID of the company.
   * @return {Promise<Buffer>} - A promise that resolves to a PDF buffer.
   */
  public async generateMatchConvocationPdf(matchId: string, companyId: string): Promise<Buffer> {

    /** Get club info and image */
    const club = await this.companyModel.findById(companyId);
    const clubImgUrl = club && club.imgUrl
      ? club.imgUrl
      : 'https://ludo-sport.s3.eu-central-1.amazonaws.com/app-settings/Logo.png';

    /** Get the match */
    const match: any = await this.matchModel.findById(matchId);

    /** Build the table data */
    const tableData = match.players.map((player: any) => [
      { text: player.lastName, alignment: 'center', bold: true },
      { text: player.firstName, alignment: 'center', bold: true },
      { text: '', alignment: 'center', bold: true }
    ]);

    /** Define the document */
    const docDefinition = {
      pageMargins : [ 40, 10, 40, 5 ],
      content     : [
        {
          image    : await this.getImage(clubImgUrl),
          width    : 75,
          alignment: 'right'
        },
        { text: match.matchName, style: 'header', alignment: 'center' },
        {
          columns: [
            {
              stack: [
                {
                  text: [
                    { text: 'Categoria: ' },
                    { text: match.team.teamName, bold: true, fontSize: 13 }
                  ]
                },
                {
                  text: [
                    { text: 'Data: ' },
                    { text: `${dateTimeConverter(match.matchDateTime)}    `, bold: true, fontSize: 13 }
                  ]
                }
              ]
            },
            {
              stack: [
                {
                  text: [
                    { text: 'Partita: ' },
                    {
                      text                                                                        : match.isHome
                        ? `${club?.companyName} - ${match.opposingTeamName}`
                        : `${match.opposingTeamName} - ${club?.companyName}`, bold: true, fontSize: 13
                    }
                  ]
                },
                {
                  text: [
                    { text: 'Località: ' },
                    { text: match.city, bold: true, fontSize: 13 }
                  ]
                }
              ]
            }
          ]
        },
        {
          text  : [
            { text: 'Ritrovo ' },
            {
              text    : `${match.address}`,
              bold    : true,
              fontSize: 13
            },
            { text: ' il ' },
            {
              text    : `${dateTimeConverter(match.meetingDateTime)}`,
              bold    : true,
              fontSize: 13
            }
          ],
          margin: [ 0, 15, 0, 0 ]
        },
        {
          style: 'playersTable',
          color: '#030712',
          table: {
            widths    : [ '*', '*', '*' ],
            headerRows: 2,
            body      : [
              [ { text: 'CONVOCAZIONE ATLETI', bold: true, colSpan: 3, alignment: 'center' }, {}, {} ],
              [
                { text: 'Cognome', style: 'tableHeader', alignment: 'center' },
                { text: 'Nome', style: 'tableHeader', alignment: 'center' },
                { text: 'Note', style: 'tableHeader', alignment: 'center' }
              ],
              ...tableData
            ]
          }
        }
      ],
      styles      : {
        header      : {
          fontSize: 20,
          bold    : true,
          margin  : [ 0, 35, 0, 35 ]
        },
        subheader   : {
          fontSize: 16,
          bold    : true,
          margin  : [ 0, 10, 0, 5 ]
        },
        playersTable: {
          margin: [ 0, 20, 0, 0 ]
        },
        tableHeader : {
          fontSize: 11,
          color   : 'black'
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      }

    };

    /** Return the doc */
    return this.createPdfDoc(docDefinition);

  }


  /**
   * Generates the training PDF document.
   *
   * @param {string} trainingId - The ID of the training.
   * @param {string} companyId - The ID of the company.
   * @return {Promise<Buffer>} - A promise that resolves with the generated PDF document.
   */
  public async generateTrainingPdf(trainingId: string, companyId: string): Promise<Buffer> {

    /** Get club info and image */
    const club = await this.companyModel.findById(companyId);
    const clubImgUrl = club && club.imgUrl
      ? club.imgUrl
      : 'https://ludo-sport.s3.eu-central-1.amazonaws.com/app-settings/Logo.png';

    /** Get the training and build the exercises table */
    const training: any = await this.trainingModel.findById(trainingId);

    /** Get and format the team */
    const team: any = await this.teamModel.findById(training.teams[0]);
    const usersInTeam: any[] = team.users.map((user: any) => [ `${user.firstName} ${user.lastName}` ]);
    const teamWork: string = usersInTeam.join(', ');

    const exercisesTableDataPromises = training.exercises.map(async (exercise: any) => [
      { text: exercise.exerciseName, alignment: 'center', fontSize: 10 },
      { text: exercise.exerciseDescription, fontSize: 9, alignment: 'center' },
      exercise.imgUrl ? { image: await this.getImage(exercise.imgUrl), alignment: 'center', width: 150 } : ''
    ]);

    const exercisesTableData = await Promise.all(exercisesTableDataPromises);

    /** Build the document content */
    const docDefinition = {
      pageMargins: 25,
      footer     : {
        text     : 'Provided by Ludo (www.ludo-sport.com)',
        fontSize : 7,
        alignment: 'center'
      },
      content    : [
        {
          columns  : [
            {
              image    : await this.getImage(clubImgUrl),
              width    : 75,
              alignment: 'left',
              margin   : [ 0, 15, 0, 0 ]
            },
            {
              table: {
                widths    : [ 80, '*' ],
                headerRows: 1,
                body      : [
                  [
                    { text: 'SCHEDA ALLENAMENTO', style: 'tableHeader', colSpan: 2 },
                    {}
                  ],
                  [
                    { text: 'DATA', fontSize: 9 },
                    { text: dateConverter(training.trainingDate), bold: true, fontSize: 10 }
                  ],
                  [
                    { text: 'CATEGORIA', fontSize: 9 },
                    { text: team.teamName, bold: true, fontSize: 10 }
                  ],
                  [
                    { text: 'STAFF', fontSize: 9 },
                    { text: teamWork, bold: true, fontSize: 10 }
                  ],
                  [
                    { text: 'ASSENZE', fontSize: 9 },
                    { text: '', bold: true, fontSize: 10 }
                  ]
                ]
              }
            }
          ],
          columnGap: 50,
          margin   : [ 0, 0, 0, 10 ]
        },
        {
          margin: [ 0, 10, 0, 0 ],
          table : {
            widths    : [ 75, 175, '*' ],
            headerRows: 1,
            body      : [
              [
                { text: 'ESERCIZIO', style: 'tableHeader' },
                { text: 'DESCRIZIONE', style: 'tableHeader' },
                { text: 'IMMAGINE', style: 'tableHeader' }
              ],
              ...exercisesTableData
            ]
          }
        },
        {
          pageBreak: 'before',
          margin   : [ 0, 10, 0, 0 ],
          table    : {
            widths    : [ 100, '*' ],
            headerRows: 1,
            body      : [
              [
                { text: 'ALLENAMENTO', style: 'tableHeader', colSpan: 2 },
                {}
              ],
              [
                { text: 'DESCRIZIONE', fontSize: 9, bold: true },
                { text: training.trainingDescription, fontSize: 9 }
              ],
              [
                { text: 'NOTE', fontSize: 9, bold: true },
                { text: training.trainingNotes, fontSize: 9 }
              ]
            ]
          }
        }
      ],
      styles     : {
        cellContent      : {
          fontSize: 9,
          color   : '#0A0A0A'
        },
        cellContentCenter: {
          fontSize : 9,
          alignment: 'center',
          color    : '#0A0A0A'
        },
        tableHeader      : {
          bold     : true,
          fontSize : 9,
          color    : 'black',
          alignment: 'center',
          fillColor: '#E7E5E4'
        }
      }

    };

    /** Return the doc */
    return this.createPdfDoc(docDefinition);
  }


  public async generateTeamListPdf(matchId: string, companyId: string) {

    /** Get club info and image */
    const club: any = await this.companyModel.findById(companyId);
    const clubImgUrl = club && club.imgUrl
      ? club.imgUrl
      : 'https://ludo-sport.s3.eu-central-1.amazonaws.com/app-settings/Logo.png';

    /** Get the match */
    const match: any = await this.matchModel.findById(matchId);

    /** Sort the players array */
    const playersSorted = match.players.sort((a: any, b: any) => {
      return a.shirtNumber - b.shirtNumber;
    });

    /** Build players table data */
    const playersTableData = playersSorted.map((player: any) => {

      /** Initialize date object */
      const birthDate = new Date(player.birthDate);

      /** Find the document to insert */
      if (player.documents) {
        const docsForTeamList = player.documents.filter((doc: any) => doc.type.isForTeamList);
        const docsForTeamListSorted = docsForTeamList.sort((a: any, b: any) => {
          return a.type.teamListOrder - b.type.teamListOrder;
        });
        const docToInsert = docsForTeamListSorted[0];

        return [
          { text: player.shirtNumber, fontSize: 9, color: '#0A0A0A', alignment: 'center' },
          { text: `${player.lastName} ${player.firstName}`, fontSize: 9, color: '#0A0A0A' },
          { text: '', style: 'cellContent' },
          { text: docToInsert.type.teamListOrder === 1 ? docToInsert.number : '', style: 'cellContent' },
          { text: docToInsert.type.teamListOrder === 2 ? 'C.I.' : '', style: 'cellContent' },
          { text: docToInsert.type.teamListOrder === 2 ? docToInsert.number : '', style: 'cellContent' },
          { text: docToInsert.type.teamListOrder === 2 ? docToInsert.releasePlace : '', style: 'cellContent' },
          { text: ('0' + birthDate.getDate()).slice(-2), style: 'cellContent' },
          { text: ('0' + (birthDate.getMonth() + 1)).slice(-2), style: 'cellContent' },
          { text: birthDate.getFullYear().toString().slice(-2), style: 'cellContent' }
        ];
      }

      return [
        { text: player.shirtNumber, fontSize: 9, color: '#0A0A0A', alignment: 'center' },
        { text: `${player.lastName} ${player.firstName}`, fontSize: 9, color: '#0A0A0A' },
        { text: '', style: 'cellContent' },
        { text: '', style: 'cellContent' },
        { text: '', style: 'cellContent' },
        { text: '', style: 'cellContent' },
        { text: '', style: 'cellContent' },
        { text: ('0' + birthDate.getDate()).slice(-2), style: 'cellContent' },
        { text: ('0' + (birthDate.getMonth() + 1)).slice(-2), style: 'cellContent' },
        { text: birthDate.getFullYear().toString().slice(-2), style: 'cellContent' }
      ];
    });

    /** Build staff table */
    const staffTable = match.teamListStaff.map((staff: any) => [
      { text: staff.role, style: 'cellContentLight' },
      { text: staff.user ? `${staff.user.lastName} ${staff.user.firstName}` : '', fontSize: 9, color: '#0A0A0A' },
      {},
      {},
      {},
      {}
    ]);

    /** Build the final doc */
    const docDefinition = {
      pageMargins : 25,
      content     : [
        {
          columnGap: 25,
          columns  : [
            {
              image    : await this.getImage(clubImgUrl),
              width    : 75,
              alignment: 'left',
              margin   : [ 0, 15, 0, 0 ]
            },
            {
              stack   : [
                { text: club.companyName, fontSize: 24, margin: [ 0, 0, 0, 5 ] },
                {
                  text      : [
                    { text: 'Elenco dei calciatori che partecipano alla gara ' },
                    {
                      text                                                        : match.isHome
                        ? `${club?.companyName} - ${match.opposingTeamName}`
                        : `${match.opposingTeamName} - ${club?.companyName}`, bold: true
                    }
                  ],
                  lineHeight: 2
                },
                { text: [ { text: 'valevole per ' }, { text: match.matchName, bold: true } ], lineHeight: 2 },
                {
                  text      : [
                    { text: 'in calendario il ' },
                    { text: dateTimeConverter(match.matchDateTime), bold: true }
                  ],
                  lineHeight: 2
                },
                {
                  text      : [
                    { text: ' a ' },
                    { text: match.city, bold: true },
                    { text: ' campo ' },
                    { text: match.address, bold: true }
                  ],
                  lineHeight: 2
                }
              ],
              fontSize: 10,
              margin  : [ 0, 0, 0, 10 ]
            }
          ]
        },
        {
          table: {
            widths    : [ 30, 175, 20, 50, 20, 60, 55, 15, 15, 15 ],
            heights   : 12,
            headerRows: 2,
            // keepWithHeaderRows: 1,
            body: [
              [
                { text: 'N. Maglia', style: 'tableHeader', rowSpan: 2 },
                { text: 'Nominativo', style: 'tableHeader', rowSpan: 2 },
                { text: 'Cap', style: 'tableHeader', rowSpan: 2 },
                { text: 'N. Tessera', style: 'tableHeader', rowSpan: 2 },
                { text: 'Documento di Identificazione', colSpan: 3, style: 'tableHeader' },
                {},
                {},
                { text: 'Data di Nascita', colSpan: 3, style: 'tableHeader' },
                {},
                {}
              ],
              [
                {},
                {},
                {},
                {},
                { text: 'Tipo', style: 'tableHeader' },
                { text: 'Numero', style: 'tableHeader' },
                { text: 'Rilasciato da', style: 'tableHeader' },
                { text: 'G', style: 'tableHeader' },
                { text: 'M', style: 'tableHeader' },
                { text: 'A', style: 'tableHeader' }
              ],
              ...playersTableData
            ]
          }
        },
        {
          margin: [ 0, 10, 0, 0 ],
          table : {
            widths    : [ 100, 135, 50, 20, 60, '*' ],
            headerRows: 2,
            heights   : 12,
            body      : [
              [
                { text: 'Persone ammesse sul terreno di gioco', style: 'tableHeader', rowSpan: 2, colSpan: 2 },
                {},
                { text: 'N. Tessera', style: 'tableHeader', rowSpan: 2 },
                { text: 'Documento di Identificazione', style: 'tableHeader', colSpan: 3 },
                {},
                {}
              ],
              [
                {},
                {},
                {},
                { text: 'Tipo', style: 'tableHeader' },
                { text: 'Numero', style: 'tableHeader' },
                { text: 'Rilasciato da', style: 'tableHeader' }
              ],
              ...staffTable
            ]
          }
        },
        {
          text     : 'Si dichiara, ai sensi e per gli effetti del\'art. 61 n.5 delle N.O.I.F., che i calciatori citati in precendeza, sprovvisti di tessera federale valida per l\'anno sportivo in corso, partecipano alla gara sotto la responsabilità della società di appartenenza.',
          fontSize : 8,
          margin   : [ 0, 10, 0, 0 ],
          alignment: 'center'
        },
        {
          columns  : [
            {
              stack: [
                { text: 'L\'Arbitro', margin: [ 0, 0, 0, 20 ] },
                '________________________________________________________'
              ]
            },
            {
              stack: [
                { text: 'Il Dirigente Accompagnatore Ufficiale', margin: [ 0, 0, 0, 20 ] },
                '________________________________________________________'
              ]
            }
          ],
          alignment: 'center',
          margin   : [ 0, 15, 0, 0 ],
          fontSize : 10
        }
      ],
      styles      : {
        cellContentLight: {
          fontSize: 7
        },
        cellContent     : {
          fontSize : 8,
          alignment: 'center',
          color    : '#0A0A0A'
        },
        tableHeader     : {
          bold     : false,
          fontSize : 9,
          color    : 'black',
          alignment: 'center',
          fillColor: '#E7E5E4'
        }
      },
      defaultStyle: {
        lineHeight: 1
        // alignment: 'justify'
      }

    };

    /** Return the doc */
    return this.createPdfDoc(docDefinition);

  }


  async generateMatchAdbReport(matchId: string, companyId: string) {

    /** Get club info */
    const club: any = await this.companyModel.findById(companyId);

    /** Get the match */
    const match: any = await this.matchModel.findById(matchId);

    /** Get the current season */
    const season: any = await this.seasonModel.findById(club.currentSeason);

    /** Sort the players array */
    const playersSorted = match.players.sort((a: any, b: any) => {
      return a.shirtNumber - b.shirtNumber;
    });

    const rowsToAdd = match.adbReport.numberOfPlayers - playersSorted.length;

    if (rowsToAdd > 0) {
      for (let i = 0; i < rowsToAdd; i++) {
        playersSorted.push('empty');
      }
    }

    /** Build players table data */
    const playersTableData = playersSorted.map((player: any, index: number) => {

      /** Find the document to insert */
      if (player.documents) {

        /** Initialize date object */
        const birthDate = new Date(player.birthDate);

        const docsForTeamList = player.documents.filter((doc: any) => doc.type.isForTeamList);
        const docsForTeamListSorted = docsForTeamList.sort((a: any, b: any) => {
          return a.type.teamListOrder - b.type.teamListOrder;
        });
        const docToInsert = docsForTeamListSorted[0];

        return [
          { text: player.shirtNumber, style: 'cellContentCenter' },
          { text: ('0' + birthDate.getDate()).slice(-2), style: 'cellContentCenter' },
          { text: ('0' + (birthDate.getMonth() + 1)).slice(-2), style: 'cellContentCenter' },
          { text: birthDate.getFullYear().toString().slice(-2), style: 'cellContentCenter' },
          { text: docToInsert.type.teamListOrder === 1 ? docToInsert.number : '', style: 'cellContentCenter' },
          { text: `${player.lastName}`, style: 'cellContentCenter' },
          { text: `${player.firstName}`, style: 'cellContentCenter' },
          { text: '', style: 'cellContentCenter' },
          { text: '', style: 'cellContentCenter' },
          { text: '', style: 'cellContentCenter' }
        ];
      }
      else if (player === 'empty') {
        return [
          { text: index + 1, style: 'cellContentCenter' },
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' }
        ];
      }

      /** Initialize date object */
      const birthDate = new Date(player.birthDate);
      return [
        { text: player.shirtNumber, style: 'cellContentCenter' },
        { text: ('0' + birthDate.getDate()).slice(-2), style: 'cellContentCenter' },
        { text: ('0' + (birthDate.getMonth() + 1)).slice(-2), style: 'cellContentCenter' },
        { text: birthDate.getFullYear().toString().slice(-2), style: 'cellContentCenter' },
        { text: '', style: 'cellContentCenter' },
        { text: `${player.lastName}`, style: 'cellContentCenter' },
        { text: `${player.firstName}`, style: 'cellContentCenter' },
        { text: '', style: 'cellContentCenter' },
        { text: '', style: 'cellContentCenter' },
        { text: '', style: 'cellContentCenter' }
      ];
    });

    /** Build players table heights */
    const tableHeights = playersSorted.map((player: any) => 10);

    /** Build players empty table */
    const playersEmptyTableData = playersSorted.map((player: any, index: number) => [
      { text: index + 1, style: 'cellContentCenter' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' }
    ]);

    const playersHomeData = match.isHome ? playersTableData : playersEmptyTableData;
    const playersAwayData = !match.isHome ? playersTableData : playersEmptyTableData;

    /** Build the staff table */

    /** Build the doc */
    const docDefinition = {
      pageOrientation: 'landscape',
      pageMargins    : [ 25, 10, 25, 0 ],
      content        : [
        {
          lineHeight: 0,
          table     : {
            widths    : [ 15, 15, 15, 15, 50, 40, 110, 15, 15, 15, 15, 15, 15, 15, 85, 40, 75, 15, 15, 15 ],
            headerRows: 3,
            body      : [
              [
                {
                  text      : 'F.I.G.C. - Delegazione Provinciale/Distrettuale di ' + match.adbReport.district.toUpperCase(),
                  bold      : true,
                  fontSize  : 12,
                  colSpan   : 16,
                  lineHeight: 1
                },
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                { text: 'Stagione ' + season.name, bold: true, fontSize: 12, colSpan: 4 },
                {},
                {},
                {}
              ],
              [
                { text: 'Categoria', style: 'headerBoldCenterMedium', colSpan: 5, border: [ true, true, true, false ] },
                {},
                {},
                {},
                {},
                { text: 'Girone', style: 'headerBoldCenterMedium', border: [ true, true, true, false ] },
                {
                  text   : 'INCONTRO/CONFRONTO',
                  style  : 'headerBoldCenterMedium',
                  colSpan: 5,
                  border : [ true, true, true, false ]
                },
                {},
                {},
                {},
                {},
                { text: 'DATA', style: 'headerBoldCenterMedium', colSpan: 3, border: [ true, true, true, false ] },
                {},
                {},
                {
                  text   : 'MODALITÀ DI GIOCO',
                  style  : 'headerBoldCenterMedium',
                  colSpan: 2,
                  border : [ true, true, true, false ]
                },
                {},
                {
                  columns  : [
                    { text: 'MULTIPARTITE', style: 'tableHeaderBold' },
                    {
                      canvas: [
                        { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                      ]
                    }
                  ],
                  columnGap: 10,
                  border   : [ true, true, true, false ]
                },
                { text: 'RISULTATO', style: 'headerBoldCenterMedium', colSpan: 3, border: [ true, true, true, false ] },
                {},
                {}
              ],
              [
                {
                  text      : match.team.teamName,
                  style     : 'headerBoldCenter',
                  colSpan   : 5,
                  border    : [ true, false, true, true ],
                  lineHeight: 1
                },
                {},
                {},
                {},
                {},
                { text: match.adbReport.group, style: 'headerBoldCenter', border: [ true, false, true, true ] },
                {
                  text   : match.isHome
                    ? `${club?.companyName} - ${match.opposingTeamName}`
                    : `${match.opposingTeamName} - ${club?.companyName}`,
                  style  : 'headerBoldCenter',
                  colSpan: 5,
                  border : [ true, false, true, true ]
                },
                {},
                {},
                {},
                {},
                {
                  text   : dateConverter(match.matchDateTime),
                  style  : 'headerBoldCenter',
                  colSpan: 3,
                  border : [ true, false, true, true ]
                },
                {},
                {},
                {
                  text   : match.adbReport.gameMode,
                  style  : 'headerBoldCenter',
                  colSpan: 2,
                  border : [ true, false, true, true ]
                },
                {},
                { text: 'n° gare 2', style: 'tableHeaderBold', border: [ true, false, true, true ] },
                { text: '-', style: 'headerBoldCenter', colSpan: 3, border: [ true, false, true, true ] },
                {},
                {}
              ]
            ]
          }
        },
        {
          columns: [
            {
              lineHeight: 0.7,
              table     : {
                widths    : [ 13, 15, 15, 15, 50, 75, 75, 15, 15, 15 ],
                headerRows: 3,
                heights   : [ 10, 6, 6, ...tableHeights, 10, 10, 10 ],
                body      : [
                  [
                    {
                      text   : 'SQUADRA "A" ' + (match.isHome
                        ? club.companyName
                        : match.opposingTeamName).toUpperCase(),
                      colSpan: 10,
                      style  : 'headerBoldCenter',
                      border : [ true, false, true, true ]
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {}
                  ],
                  [
                    { text: 'N°', rowSpan: 2, style: 'tableHeaderBoldCenter', margin: [ 0, 5, 0, 0 ] },
                    { text: 'DATA NASCITA', colSpan: 3, style: 'tableHeaderBoldCenter' },
                    {},
                    {},
                    { text: 'N° CARTELLINO', rowSpan: 2, style: 'tableHeaderBoldCenter' },
                    { text: 'COGNOME', rowSpan: 2, style: 'headerBoldCenterCenter' },
                    { text: 'NOME', rowSpan: 2, style: 'headerBoldCenterCenter' },
                    { text: 'PRESENZA', colSpan: 3, style: 'tableHeaderBoldCenter' },
                    {},
                    {}
                  ],
                  [
                    {},
                    { text: 'GG', style: 'tableHeaderBoldCenter' },
                    { text: 'MM', style: 'tableHeaderBoldCenter' },
                    { text: 'AA', style: 'tableHeaderBoldCenter' },
                    {},
                    {},
                    {},
                    { text: '1°T', style: 'tableHeaderBoldCenter' },
                    { text: '2°T', style: 'tableHeaderBoldCenter' },
                    { text: '3°T', style: 'tableHeaderBoldCenter' }
                  ],
                  ...playersHomeData,
                  [
                    { text: 'TECNICO A.d.B.', colSpan: 4, style: 'tableHeaderBold' },
                    {},
                    {},
                    {},
                    { text: 'Sig.', colSpan: 2, style: 'tableHeaderBold' },
                    {},
                    { text: 'Tessera n.', colSpan: 4, style: 'tableHeaderBold' },
                    {},
                    {},
                    {}
                  ],
                  [
                    { text: 'DIRIGENTE ACC.', colSpan: 4, style: 'tableHeaderBold' },
                    {},
                    {},
                    {},
                    { text: 'Sig.', colSpan: 2, style: 'tableHeaderBold' },
                    {},
                    { text: 'Tessera n.', colSpan: 4, style: 'tableHeaderBold' },
                    {},
                    {},
                    {}
                  ],
                  [
                    { text: 'MASSAGGIATORE', colSpan: 4, style: 'tableHeaderBold' },
                    {},
                    {},
                    {},
                    { text: 'Sig.', colSpan: 2, style: 'tableHeaderBold' },
                    {},
                    { text: 'Tessera n.', colSpan: 4, style: 'tableHeaderBold' },
                    {},
                    {},
                    {}
                  ]
                ]
              }
            },
            {
              lineHeight: 0.7,
              table     : {
                widths    : [ 14, 15, 15, 15, 50, 75, 75, 15, 15, 15 ],
                heights   : [ 10, 6, 6, ...tableHeights, 10, 10, 10 ],
                headerRows: 3,
                body      : [
                  [
                    {
                      text   : 'SQUADRA "B" ' + (match.isHome
                        ? match.opposingTeamName
                        : club.companyName).toUpperCase(),
                      colSpan: 10,
                      style  : 'headerBoldCenter',
                      border : [ true, false, true, true ]
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {}
                  ],
                  [
                    { text: 'N°', rowSpan: 2, style: 'tableHeaderBoldCenter', margin: [ 0, 5, 0, 0 ] },
                    { text: 'DATA NASCITA', colSpan: 3, style: 'tableHeaderBoldCenter' },
                    {},
                    {},
                    { text: 'N° CARTELLINO', rowSpan: 2, style: 'tableHeaderBoldCenter' },
                    { text: 'COGNOME', rowSpan: 2, style: 'headerBoldCenterCenter' },
                    { text: 'NOME', rowSpan: 2, style: 'headerBoldCenterCenter' },
                    { text: 'PRESENZA', colSpan: 3, style: 'tableHeaderBoldCenter' },
                    {},
                    {}
                  ],
                  [
                    {},
                    { text: 'GG', style: 'tableHeaderBoldCenter' },
                    { text: 'MM', style: 'tableHeaderBoldCenter' },
                    { text: 'AA', style: 'tableHeaderBoldCenter' },
                    {},
                    {},
                    {},
                    { text: '1°T', style: 'tableHeaderBoldCenter' },
                    { text: '2°T', style: 'tableHeaderBoldCenter' },
                    { text: '3°T', style: 'tableHeaderBoldCenter' }
                  ],
                  /*!match.isHome ? finalPlayersTable : playersEmptyTable(14),*/
                  ...playersAwayData,
                  [
                    { text: 'TECNICO A.d.B.', colSpan: 4, style: 'tableHeaderBold' },
                    {},
                    {},
                    {},
                    { text: 'Sig.', colSpan: 2, style: 'tableHeaderBold' },
                    {},
                    { text: 'Tessera n.', colSpan: 4, style: 'tableHeaderBold' },
                    {},
                    {},
                    {}
                  ],
                  [
                    { text: 'DIRIGENTE ACC.', colSpan: 4, style: 'tableHeaderBold' },
                    {},
                    {},
                    {},
                    { text: 'Sig.', colSpan: 2, style: 'tableHeaderBold' },
                    {},
                    { text: 'Tessera n.', colSpan: 4, style: 'tableHeaderBold' },
                    {},
                    {},
                    {}
                  ],
                  [
                    { text: 'MASSAGGIATORE', colSpan: 4, style: 'tableHeaderBold' },
                    {},
                    {},
                    {},
                    { text: 'Sig.', colSpan: 2, style: 'tableHeaderBold' },
                    {},
                    { text: 'Tessera n.', colSpan: 4, style: 'tableHeaderBold' },
                    {},
                    {},
                    {}
                  ]
                ]
              }
            }
          ]
        },
        {
          columns: [
            {
              stack : [
                {
                  table: {
                    widths: [ 384 ],
                    body  : [
                      [
                        {
                          text      : 'SQUADRA "A" - DA COMPILARE A CURA DEL DIRIGENTE DELLA SQUADRA "B"',
                          fontSize  : 9,
                          bold      : true,
                          alignment : 'center',
                          lineHeight: 0.8
                        }
                      ]
                    ]
                  }
                },
                {
                  columns: [
                    {
                      lineHeight: 0,
                      width     : 166,
                      table     : {
                        widths: [ 95, 50 ],
                        body  : [
                          [
                            {
                              columns  : [
                                {
                                  text      : 'SALUTO INIZIO E FINE GARA',
                                  style     : 'tableHeaderBoldCenter',
                                  width     : 'auto',
                                  lineHeight: 0.8
                                },
                                {
                                  canvas: [
                                    { type: 'rect', x: 0, y: 5, w: 8, h: 8, r: 0 }
                                  ]
                                }
                              ],
                              columnGap: 10,
                              border   : [ true ]
                            },
                            {
                              columns  : [
                                { text: 'TIME OUT', style: 'tableHeaderBoldCenter', lineHeight: 0.8 },
                                {
                                  canvas   : [
                                    { type: 'rect', x: 0, y: 5, w: 8, h: 8, r: 0 }
                                  ],
                                  alignment: 'right'
                                }
                              ],
                              columnGap: 10,
                              border   : [ true, false, true, true ]
                            }
                          ],
                          [
                            {
                              columns  : [
                                { text: 'GREEN CARD', style: 'tableHeaderBoldCenter', width: 90 },
                                {
                                  canvas   : [
                                    { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                  ],
                                  alignment: 'right'
                                }
                              ],
                              columnGap: 10,
                              border   : [ true, true, false, true ]
                            },
                            {
                              text  : 'N° _____',
                              style : 'tableHeaderBoldCenter',
                              border: [ false, true, true, true ]
                            }
                          ],
                          [
                            {
                              columns  : [
                                { text: 'BAMBINE', style: 'tableHeaderBoldCenter', width: 90 },
                                {
                                  canvas   : [
                                    { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                  ],
                                  alignment: 'right'
                                }
                              ],
                              columnGap: 10,
                              border   : [ true, true, false, true ]
                            },
                            {
                              text  : 'N° _____',
                              style : 'tableHeaderBoldCenter',
                              border: [ false, true, true, true ]
                            }
                          ],
                          [
                            {
                              text      : 'SOSTITUZIONI REGOLARI SQ. "A"',
                              style     : 'tableHeaderBoldCenter',
                              border    : [ true, true, false, true ],
                              width     : 100,
                              lineHeight: 0.8
                            },
                            {
                              stack : [
                                {
                                  columns: [
                                    { text: 'SI', style: 'tableHeaderBoldCenter' },
                                    {
                                      canvas   : [
                                        { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                      ],
                                      alignment: 'right'
                                    }
                                  ]
                                },
                                {
                                  columns: [
                                    { text: 'NO', style: 'tableHeaderBoldCenter' },
                                    {
                                      canvas   : [
                                        { type: 'rect', x: 0, y: 1, w: 8, h: 8, r: 0 }
                                      ],
                                      alignment: 'right'
                                    }
                                  ]
                                }
                              ],
                              border: [ false, true, true, true ]
                            }
                          ]
                        ]
                      }
                    },
                    {
                      lineHeight: 0.8,
                      stack     : [
                        {
                          table: {
                            alignment: 'left',
                            widths   : [ 70, 65, 65 ],
                            body     : [
                              [
                                {
                                  text  : 'COMPORTAMENTO CALCIATORI SQ."A"',
                                  style : 'tableHeaderBoldCenter',
                                  border: [ true, false, false, true ],
                                  width : 70
                                },
                                {
                                  stack : [
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'INSUFFICIENTE', style: 'cellContent_7', alignment: 'left' }
                                      ]
                                    },
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          width    : 10,
                                          alignment: 'left'
                                        },
                                        { text: 'BUONO', style: 'cellContent_7' }
                                      ]
                                    }
                                  ],
                                  border: [ false, false, false, true ],
                                  width : 62
                                },
                                {
                                  stack : [
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'SUFFICIENTE', style: 'cellContent_7' }
                                      ]
                                    },
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'OTTIMO', style: 'cellContent_7', alignment: 'left', width: 'auto' }
                                      ]
                                    }
                                  ],
                                  border: [ false, false, true, true ],
                                  width : 62
                                }
                              ]
                            ]
                          }
                        },
                        {
                          table: {
                            alignment: 'left',
                            widths   : [ 70, 65, 65 ],
                            body     : [
                              [
                                {
                                  text  : 'COMPORTAMENTO DIRIGENTI SQ."A"',
                                  style : 'tableHeaderBoldCenter',
                                  border: [ true, false, false, true ],
                                  width : 70
                                },
                                {
                                  stack : [
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'INSUFFICIENTE', style: 'cellContent_7', alignment: 'left' }
                                      ]
                                    },
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          width    : 10,
                                          alignment: 'left'
                                        },
                                        { text: 'BUONO', style: 'cellContent_7' }
                                      ]
                                    }
                                  ],
                                  border: [ false, false, false, true ],
                                  width : 62
                                },
                                {
                                  stack : [
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'SUFFICIENTE', style: 'cellContent_7' }
                                      ]
                                    },
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'OTTIMO', style: 'cellContent_7', alignment: 'left', width: 'auto' }
                                      ]
                                    }
                                  ],
                                  border: [ false, false, true, true ],
                                  width : 62
                                }
                              ]
                            ]
                          }
                        },
                        {
                          table: {
                            alignment: 'left',
                            widths   : [ 70, 65, 65 ],
                            body     : [
                              [
                                {
                                  text  : 'COMPORTAMENTO PUBBLICO SQ."A"',
                                  style : 'tableHeaderBoldCenter',
                                  border: [ true, false, false, true ],
                                  width : 70
                                },
                                {
                                  stack : [
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'INSUFFICIENTE', style: 'cellContent_7', alignment: 'left' }
                                      ]
                                    },
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          width    : 10,
                                          alignment: 'left'
                                        },
                                        { text: 'BUONO', style: 'cellContent_7' }
                                      ]
                                    }
                                  ],
                                  border: [ false, false, false, true ],
                                  width : 62
                                },
                                {
                                  margin: 1.4,
                                  stack : [
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'SUFFICIENTE', style: 'cellContent_7' }
                                      ]
                                    },
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'OTTIMO', style: 'cellContent_7', alignment: 'left', width: 'auto' }
                                      ]
                                    }
                                  ],
                                  border: [ false, false, true, true ],
                                  width : 62
                                }
                              ]
                            ]
                          }
                        }
                      ]
                    }
                  ]
                }
              ],
              margin: [ 0, 2, 0, 0 ]
            },
            {
              stack : [
                {
                  table: {
                    widths: [ 385 ],
                    body  : [
                      [
                        {
                          text      : 'SQUADRA "B" - DA COMPILARE A CURA DEL DIRIGENTE DELLA SQUADRA "A"',
                          fontSize  : 9,
                          bold      : true,
                          alignment : 'center',
                          lineHeight: 0.8
                        }
                      ]
                    ]
                  }
                },
                {
                  columns: [
                    {
                      lineHeight: 0,
                      width     : 164,
                      table     : {
                        widths: [ 93, 50 ],
                        body  : [
                          [
                            {
                              columns  : [
                                {
                                  text      : 'SALUTO INIZIO E FINE GARA',
                                  style     : 'tableHeaderBoldCenter',
                                  width     : 'auto',
                                  lineHeight: 0.8
                                },
                                {
                                  canvas: [
                                    { type: 'rect', x: 0, y: 5, w: 8, h: 8, r: 0 }
                                  ]
                                }
                              ],
                              columnGap: 10,
                              border   : [ true ]
                            },
                            {
                              columns  : [
                                { text: 'TIME OUT', style: 'tableHeaderBoldCenter', lineHeight: 0.8 },
                                {
                                  canvas   : [
                                    { type: 'rect', x: 0, y: 5, w: 8, h: 8, r: 0 }
                                  ],
                                  alignment: 'right'
                                }
                              ],
                              columnGap: 10,
                              border   : [ true, false, true, true ]
                            }
                          ],
                          [
                            {
                              columns  : [
                                { text: 'GREEN CARD', style: 'tableHeaderBoldCenter', width: 90 },
                                {
                                  canvas   : [
                                    { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                  ],
                                  alignment: 'right'
                                }
                              ],
                              columnGap: 10,
                              border   : [ true, true, false, true ]
                            },
                            {
                              text  : 'N° _____',
                              style : 'tableHeaderBoldCenter',
                              border: [ false, true, true, true ]
                            }
                          ],
                          [
                            {
                              columns  : [
                                { text: 'BAMBINE', style: 'tableHeaderBoldCenter', width: 90 },
                                {
                                  canvas   : [
                                    { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                  ],
                                  alignment: 'right'
                                }
                              ],
                              columnGap: 10,
                              border   : [ true, true, false, true ]
                            },
                            {
                              text  : 'N° _____',
                              style : 'tableHeaderBoldCenter',
                              border: [ false, true, true, true ]
                            }
                          ],
                          [
                            {
                              text      : 'SOSTITUZIONI REGOLARI SQ. "B"',
                              style     : 'tableHeaderBoldCenter',
                              border    : [ true, true, false, true ],
                              width     : 100,
                              lineHeight: 0.8
                            },
                            {
                              stack : [
                                {
                                  columns: [
                                    { text: 'SI', style: 'tableHeaderBoldCenter' },
                                    {
                                      canvas   : [
                                        { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                      ],
                                      alignment: 'right'
                                    }
                                  ]
                                },
                                {
                                  columns: [
                                    { text: 'NO', style: 'tableHeaderBoldCenter' },
                                    {
                                      canvas   : [
                                        { type: 'rect', x: 0, y: 1, w: 8, h: 8, r: 0 }
                                      ],
                                      alignment: 'right'
                                    }
                                  ]
                                }
                              ],
                              border: [ false, true, true, true ]
                            }
                          ]
                        ]
                      }
                    },
                    {
                      lineHeight: 0.8,
                      stack     : [
                        {
                          table: {
                            alignment: 'left',
                            widths   : [ 73, 65, 65 ],
                            body     : [
                              [
                                {
                                  text  : 'COMPORTAMENTO CALCIATORI SQ."B"',
                                  style : 'tableHeaderBoldCenter',
                                  border: [ true, false, false, true ],
                                  width : 73
                                },
                                {
                                  stack : [
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'INSUFFICIENTE', style: 'cellContent_7', alignment: 'left' }
                                      ]
                                    },
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          width    : 10,
                                          alignment: 'left'
                                        },
                                        { text: 'BUONO', style: 'cellContent_7' }
                                      ]
                                    }
                                  ],
                                  border: [ false, false, false, true ],
                                  width : 62
                                },
                                {
                                  stack : [
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'SUFFICIENTE', style: 'cellContent_7' }
                                      ]
                                    },
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'OTTIMO', style: 'cellContent_7', alignment: 'left', width: 'auto' }
                                      ]
                                    }
                                  ],
                                  border: [ false, false, true, true ],
                                  width : 62
                                }
                              ]
                            ]
                          }
                        },
                        {
                          table: {
                            alignment: 'left',
                            widths   : [ 73, 65, 65 ],
                            body     : [
                              [
                                {
                                  text  : 'COMPORTAMENTO DIRIGENTI SQ."B"',
                                  style : 'tableHeaderBoldCenter',
                                  border: [ true, false, false, true ],
                                  width : 70
                                },
                                {
                                  stack : [
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'INSUFFICIENTE', style: 'cellContent_7', alignment: 'left' }
                                      ]
                                    },
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          width    : 10,
                                          alignment: 'left'
                                        },
                                        { text: 'BUONO', style: 'cellContent_7' }
                                      ]
                                    }
                                  ],
                                  border: [ false, false, false, true ],
                                  width : 62
                                },
                                {
                                  stack : [
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'SUFFICIENTE', style: 'cellContent_7' }
                                      ]
                                    },
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'OTTIMO', style: 'cellContent_7', alignment: 'left', width: 'auto' }
                                      ]
                                    }
                                  ],
                                  border: [ false, false, true, true ],
                                  width : 62
                                }
                              ]
                            ]
                          }
                        },
                        {
                          table: {
                            alignment: 'left',
                            widths   : [ 73, 65, 65 ],
                            body     : [
                              [
                                {
                                  text  : 'COMPORTAMENTO PUBBLICO SQ."B"',
                                  style : 'tableHeaderBoldCenter',
                                  border: [ true, false, false, true ],
                                  width : 70
                                },
                                {
                                  stack : [
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'INSUFFICIENTE', style: 'cellContent_7', alignment: 'left' }
                                      ]
                                    },
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          width    : 10,
                                          alignment: 'left'
                                        },
                                        { text: 'BUONO', style: 'cellContent_7' }
                                      ]
                                    }
                                  ],
                                  border: [ false, false, false, true ],
                                  width : 62
                                },
                                {
                                  margin: 1.4,
                                  stack : [
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'SUFFICIENTE', style: 'cellContent_7' }
                                      ]
                                    },
                                    {
                                      columns: [
                                        {
                                          canvas   : [
                                            { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                                          ],
                                          alignment: 'left',
                                          width    : 10
                                        },
                                        { text: 'OTTIMO', style: 'cellContent_7', alignment: 'left', width: 'auto' }
                                      ]
                                    }
                                  ],
                                  border: [ false, false, true, true ],
                                  width : 62
                                }
                              ]
                            ]
                          }
                        }
                      ]
                    }
                  ]
                }
              ],
              margin: [ 0, 2, 0, 0 ]
            }
          ]
        },
        {
          table: {
            widths: [ 210, 343, 210 ],
            body  : [
              [
                {
                  border : [ true, false, true, true ],
                  columns: [
                    {
                      text : 'FIRMA DIRIGENTE SQUADRA "A"',
                      style: 'tableHeaderBoldCenter',
                      width: 100
                    },
                    {
                      canvas   : [
                        { type: 'rect', x: 0, y: 15, w: 110, h: 0, r: 0, dash: { length: 0.8, space: 2 } }
                      ],
                      alignment: 'center'
                    }
                  ]
                },
                {
                  border : [ true, false, true, true ],
                  columns: [
                    {
                      text  : 'ARBITRO Sig.',
                      style : 'tableHeaderBoldCenter',
                      width : 50,
                      margin: [ 0, 9, 0, 0 ]
                    },
                    {
                      text : '',
                      width: 100
                    },
                    {
                      stack : [
                        {
                          columns: [
                            {
                              canvas   : [
                                { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                              ],
                              alignment: 'left',
                              width    : 10
                            },
                            { text: 'Tecnico', style: 'cellContent', alignment: 'left' }
                          ]
                        },
                        {
                          columns: [
                            {
                              canvas   : [
                                { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 0 }
                              ],
                              width    : 10,
                              alignment: 'left'
                            },
                            {
                              columns: [
                                { text: 'Dirigente', style: 'cellContent', width: 32 },
                                {
                                  text : 'FIRMA',
                                  style: 'tableHeaderBoldCenter',
                                  width: 50
                                },
                                {
                                  canvas   : [
                                    { type: 'rect', x: 0, y: 7, w: 90, h: 0, r: 0, dash: { length: 0.8, space: 2 } }
                                  ],
                                  alignment: 'center'
                                }
                              ]
                            }
                          ]
                        }
                      ],
                      border: [ false, false, false, true ],
                      width : 62
                    }
                  ]
                },
                {
                  border : [ true, false, true, true ],
                  columns: [
                    {
                      text : 'FIRMA DIRIGENTE SQUADRA "B"',
                      style: 'tableHeaderBoldCenter',
                      width: 100
                    },
                    {
                      canvas   : [
                        { type: 'rect', x: 0, y: 15, w: 110, h: 0, r: 0, dash: { length: 0.8, space: 2 } }
                      ],
                      alignment: 'center'
                    }
                  ]
                }
              ]
            ]
          }
        },
        {
          margin: [ 0, 0, 1, 0 ],
          table : {
            widths: [ '*', '*' ],
            body  : [
              [
                {
                  text      : 'FAIR PLAY SQUADRA "A" - TOTALE PUNTI',
                  bold      : true,
                  fontSize  : 8,
                  border    : [ true, false, false, true ],
                  lineHeight: 0.8
                },
                {
                  text      : 'FAIR PLAY SQUADRA "B" - TOTALE PUNTI',
                  bold      : true,
                  fontSize  : 8,
                  border    : [ false, false, true, true ],
                  lineHeight: 0.8
                }
              ],
              [
                {
                  text      : 'Da consegnare in busta chiusa, oppure a mezzo "Posta prioritaria" e/o mezzo FAX tel. ________________________ entro le 48 ore successive alla gara.',
                  fontSize  : 8,
                  bold      : true,
                  alignment : 'center',
                  colSpan   : 2,
                  border    : [ true, true, true, false ],
                  lineHeight: 0.4
                },
                {}
              ],
              [
                {
                  text     : 'Qualora gli spazi presenti sul referto di gara non fossero sufficienti, è possibile inviare fogli allegati, su carta intestata della Società, per il supplemento di informazioni debitamente firmati.',
                  fontSize : 8,
                  alignment: 'center',
                  colSpan  : 2,
                  border   : [ true, false, true, true ]
                },
                {}
              ]
            ]
          }
        }
      ],
      styles         : {
        headerBoldCenterCenter: {
          fontSize : 9,
          bold     : true,
          alignment: 'center',
          margin   : [ 0, 5, 0, 0 ]
        },
        headerBoldCenter      : {
          fontSize : 9,
          bold     : true,
          alignment: 'center'
        },
        headerBoldCenterMedium: {
          fontSize : 9,
          bold     : true,
          alignment: 'center'
        },
        cellContent           : {
          fontSize: 8
        },
        cellContent_7         : {
          fontSize: 7
        },
        cellContentCenter     : {
          fontSize : 8,
          alignment: 'center'
        },
        tableHeaderBold       : {
          fontSize: 8,
          bold    : true
        },
        tableHeaderBoldCenter : {
          fontSize : 8,
          bold     : true,
          alignment: 'center'
        },
        tableHeaderCenter     : {
          fontSize : 8,
          alignment: 'center'
        }
      }

    };

    /** Return the doc */
    return this.createPdfDoc(docDefinition);
  }


  /**
   * Generates a match report PDF.
   * @param {string} matchId - The ID of the match.
   * @param {string} companyId - The ID of the company.
   * @returns {Promise<void>} A Promise that resolves once the PDF is generated.
   */
  async generateMatchReportPdf(matchId: string, companyId: string): Promise<Buffer> {
    /** Get club info and image */
    const club: any = await this.companyModel.findById(companyId);
    const clubImgUrl = club && club.imgUrl
      ? club.imgUrl
      : 'https://ludo-sport.s3.eu-central-1.amazonaws.com/app-settings/Logo.png';

    /** Get the match */
    const match: any = await this.matchModel.findById(matchId);

    /** Sort the players array */
    const playersSorted = match.players.sort((a: any, b: any) => {
      return a.shirtNumber - b.shirtNumber;
    });

    /** Generate players report table */
    const playersTableReport = playersSorted.map((player: any) => [
      { text: player.shirtNumber, style: 'cellContentCenter' },
      { text: `${player.lastName} ${player.firstName}`, style: 'cellContent' },
      { text: player.minutes, style: 'cellContentCenter' },
      { text: player.goals, style: 'cellContentCenter' },
      { text: player.rating, style: 'cellContentCenter' },
      { text: player.matchNotes, fontSize: 8 }
    ]);

    /** Build the doc */
    const docDefinition = {
      footer     : {
        text     : 'Provided by Ludo (www.ludo-sport.com)',
        fontSize : 8,
        alignment: 'center'
      },
      pageMargins: 25,
      content    : [
        {
          columns  : [
            {
              image    : await this.getImage(clubImgUrl),
              width    : 75,
              alignment: 'left',
              margin   : [ 0, 15, 0, 0 ]
            },
            {
              table: {
                widths    : [ 80, '*' ],
                headerRows: 1,
                body      : [
                  [
                    { text: 'REPORT PARTITA', style: 'tableHeader', colSpan: 2 },
                    {}
                  ],
                  [
                    { text: 'MANIFESTAZIONE', fontSize: 9 },
                    { text: match.matchName, bold: true, fontSize: 10 }
                  ],
                  [
                    { text: 'CATEGORIA', fontSize: 9 },
                    { text: match.team.teamName, bold: true, fontSize: 10 }
                  ],
                  [
                    { text: 'GARA', fontSize: 9 },
                    {
                      text                                                                        : match.isHome
                        ? `${club?.companyName} - ${match.opposingTeamName}`
                        : `${match.opposingTeamName} - ${club?.companyName}`, bold: true, fontSize: 10
                    }
                  ],
                  [
                    { text: 'RISULTATO', fontSize: 9 },
                    { text: `${match.homeGoals} - ${match.awayGoals}`, bold: true, fontSize: 10 }
                  ],
                  [
                    { text: 'DATA', fontSize: 9 },
                    { text: dateConverter(match.matchDateTime), bold: true, fontSize: 10 }
                  ]
                ]
              }
            }
          ],
          columnGap: 50,
          margin   : [ 0, 0, 0, 10 ]
        },
        {
          margin: [ 0, 10, 0, 0 ],
          table : {
            widths    : [ 20, 100, 45, 45, 45, '*' ],
            headerRows: 1,
            body      : [
              [
                { text: 'N°', style: 'tableHeader' },
                { text: 'NOME', style: 'tableHeader' },
                { text: 'MINUTI', style: 'tableHeader' },
                { text: 'GOAL', style: 'tableHeader' },
                { text: 'VOTO', style: 'tableHeader' },
                { text: 'NOTE', style: 'tableHeader' }
              ],
              ...playersTableReport
            ]
          }
        },
        {
          pageBreak: 'before',
          margin   : [ 0, 10, 0, 0 ],
          table    : {
            widths    : [ 100, '*' ],
            headerRows: 1,
            body      : [
              [
                { text: 'RELAZIONE', style: 'tableHeader', colSpan: 2 },
                {}
              ],
              [
                { text: 'FASE DI POSSESSO', fontSize: 9, bold: true },
                { text: '', fontSize: 9 }
              ],
              [
                { text: 'FASE DI NON POSSESSO', fontSize: 9, bold: true },
                { text: '', fontSize: 9 }
              ],
              [
                { text: 'COSTRUZIONE', fontSize: 9, bold: true },
                { text: '', fontSize: 9 }
              ],
              [
                { text: 'GENERALE', fontSize: 9, bold: true },
                { text: '', fontSize: 9 }
              ]
            ]
          }
        }
      ],
      styles     : {
        cellContent      : {
          fontSize: 9,
          color   : '#0A0A0A'
        },
        cellContentCenter: {
          fontSize : 9,
          alignment: 'center',
          color    : '#0A0A0A'
        },
        tableHeader      : {
          bold     : true,
          fontSize : 9,
          color    : 'black',
          alignment: 'center',
          fillColor: '#E7E5E4'
        }
      }

    };

    /** Return the doc */
    return this.createPdfDoc(docDefinition);
  }


  /**
   * Generates a player report for the given player and company.
   * @param {string} playerId - The ID of the player.
   * @param {string} companyId - The ID of the company.
   * @return {Promise<object>} - The generated PDF document.
   */
  async generatePlayerReport(playerId: string, companyId: string): Promise<object> {

    /** Get club info and image */
    const club: any = await this.companyModel.findById(companyId);
    const clubImgUrl = club && club.imgUrl
      ? club.imgUrl
      : 'https://ludo-sport.s3.eu-central-1.amazonaws.com/app-settings/Logo.png';

    /** Get the player */
    const player: any = await this.playerModel.findById(playerId);

    /** Get the player team */
    const team: any = await this.teamModel.findById(player.teams[0]);

    /** Build the pipeline to get all the matches and aggregate the stats */
    const pipeline = [
      {
        $match: {
          'players._id': playerId
        }
      },
      {
        $project: {
          matchDetails: {
            homeGoals       : '$homeGoals',
            awayGoals       : '$awayGoals',
            opposingTeamName: '$opposingTeamName',
            isHome          : '$isHome'
          },
          playerStats : {
            $filter: {
              input: '$players',
              as   : 'player',
              cond : { $eq: [ '$$player._id', playerId ] }
            }
          }
        }
      }
    ];
    /** Execute the aggregation */
    const aggregate = await this.matchModel.aggregate(pipeline).exec();

    /** Build the player matches table data */
    const matchesTableData = aggregate.map((match: any) => {
      return [
        {
          text : match.matchDetails.isHome
            ? `${club?.companyName} - ${match.matchDetails.opposingTeamName}`
            : `${match.matchDetails.opposingTeamName} - ${club?.companyName}`,
          style: 'cellContentCenter'
        },
        { text: `${match.matchDetails.homeGoals} - ${match.matchDetails.awayGoals}`, style: 'cellContentCenter' },
        { text: match.playerStats[0].minutes, style: 'cellContentCenter' },
        { text: match.playerStats[0].goals, style: 'cellContentCenter' },
        { text: match.playerStats[0].rating, style: 'cellContentCenter' },
        { text: match.playerStats[0].matchNotes, fontSize: 7 }
      ];
    });

    /** Build the final doc */
    const docDefinition = {
      footer     : {
        text     : 'Provided by Ludo (www.ludo-sport.com)',
        fontSize : 8,
        alignment: 'center'
      },
      pageMargins: 25,
      content    : [
        {
          columns  : [
            {
              image    : await this.getImage(clubImgUrl),
              width    : 75,
              alignment: 'left',
              margin   : [ 0, 15, 0, 0 ]
            },
            {
              table: {
                widths    : [ 80, '*' ],
                headerRows: 1,
                body      : [
                  [
                    { text: 'SCHEDA GIOCATORE', style: 'tableHeader', colSpan: 2 },
                    {}
                  ],
                  [
                    { text: 'NOME', fontSize: 9 },
                    { text: `${player.lastName} ${player.firstName}`, bold: true, fontSize: 10 }
                  ],
                  [
                    { text: 'CATEGORIA', fontSize: 9 },
                    { text: team.teamName, bold: true, fontSize: 10 }
                  ],
                  [
                    { text: 'RUOLO', fontSize: 9 },
                    { text: player.roles.map((role: any) => role.roleName).toString(), bold: true, fontSize: 10 }
                  ],
                  [
                    { text: 'ASSENZE', fontSize: 9 },
                    //TODO: find all the training absences
                    { text: '', bold: true, fontSize: 10 }
                  ],
                  [
                    { text: 'VALORE', fontSize: 9 },
                    { text: player.value, bold: true, fontSize: 10 }
                  ]
                ]
              }
            }
          ],
          columnGap: 50,
          margin   : [ 0, 0, 0, 10 ]
        },
        {
          margin: [ 0, 10, 0, 0 ],
          table : {
            widths    : [ 150, 50, 45, 45, 45, '*' ],
            headerRows: 2,
            body      : [
              [
                { text: `PARTITE GIOCATE | ${aggregate.length}`, style: 'tableHeaderBig', colSpan: 6 },
                {},
                {},
                {},
                {},
                {}
              ],
              [
                { text: 'PARTITA', style: 'tableHeader' },
                { text: 'RISULTATO', style: 'tableHeader' },
                { text: 'MINUTI', style: 'tableHeader' },
                { text: 'GOAL', style: 'tableHeader' },
                { text: 'VOTO', style: 'tableHeader' },
                { text: 'NOTE', style: 'tableHeader' }
              ],
              ...matchesTableData
            ]
          }
        },
        {
          margin   : [ 0, 15, 0, 0 ],
          pageBreak: 'before',
          table    : {
            widths    : [ 130, '*' ],
            headerRows: 1,
            body      : [
              [
                { text: 'STATISTICHE TOTALI', style: 'tableHeaderBig', colSpan: 2 },
                {}
              ],
              [
                { text: 'PRESENZE TOTALI', fontSize: 9 },
                { text: player.totalMatches, bold: true, fontSize: 10 }
              ],
              [
                { text: 'MINUTI TOTALI', fontSize: 9 },
                { text: player.totalMinutes, bold: true, fontSize: 10 }
              ],
              [
                { text: 'MEDIA MINUTI A PARTITA', fontSize: 9 },
                { text: (player.totalMinutes / player.totalMatches), bold: true, fontSize: 10 }
              ],
              [
                { text: 'GOAL TOTALI', fontSize: 9 },
                { text: player.totalGoals, bold: true, fontSize: 10 }
              ],
              [
                { text: 'VOTO MEDIO', fontSize: 9 },
                {
                  text    : (aggregate.reduce((sum, match) => sum + match.playerStats[0].rating, 0) / aggregate.length),
                  bold    : true,
                  fontSize: 10
                }
              ]
            ]
          }
        }
      ],
      styles     : {
        cellContent      : {
          fontSize: 9,
          color   : '#0A0A0A'
        },
        cellContentCenter: {
          fontSize : 9,
          alignment: 'center',
          color    : '#0A0A0A'
        },
        tableHeader      : {
          bold     : true,
          fontSize : 9,
          color    : 'black',
          alignment: 'center',
          fillColor: '#E7E5E4'
        },
        tableHeaderBig   : {
          bold     : true,
          fontSize : 11,
          color    : 'black',
          alignment: 'center',
          fillColor: '#E7E5E4'
        }
      }

    };

    /** Return the doc */
    return this.createPdfDoc(docDefinition);

  }

}
