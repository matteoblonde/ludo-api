import { Inject } from '@nestjs/common';
import axios from 'axios';
import PdfPrinter from 'pdfmake';
import CompanyModel from '../../database/models/Company/Company';
import MatchModel from '../../database/models/Match/Match';
import TeamModel from '../../database/models/Team/Team';
import TrainingModel from '../../database/models/Training/Training';
import { dateTimeConverter } from '../../utils/date/date-converter';


export class PrinterService {

  constructor(
    @Inject(MatchModel.collection.name)
    private readonly matchModel: typeof MatchModel,
    @Inject(CompanyModel.collection.name)
    private readonly companyModel: typeof CompanyModel,
    @Inject(TrainingModel.collection.name)
    private readonly trainingModel: typeof TrainingModel,
    @Inject(TeamModel.collection.name)
    private readonly teamModel: typeof TeamModel
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
      [
        { text: exercise.exerciseName, alignment: 'center', bold: true, style: 'tableRow' },
        { text: exercise.exerciseDescription, fontSize: 10, alignment: 'center', style: 'tableRow' }
      ],
      { image: await this.getImage(exercise.imgUrl), alignment: 'center', width: 150, style: 'tableRow' }
    ]);

    const exercisesTableData = await Promise.all(exercisesTableDataPromises);

    /** Build the document content */
    const docDefinition = {
      pageMargins: [ 40, 40 ],
      footer     : {
        image: await this.getImage(clubImgUrl), width: 35, alignment: 'center', margin: [ 0, 0, 0, 5 ]
      },
      content    : [
        {
          style: 'tableExample',
          table: {
            widths    : [ '*', '*' ],
            headerRows: 1,
            body      : [
              [
                { text: training.trainingTitle, style: 'header', colSpan: 2, alignment: 'center' },
                {}
              ],
              [
                {
                  text : [
                    { text: 'Staff: ', bold: true },
                    { text: teamWork, fontSize: 10 }
                  ],
                  style: 'tableRow'
                },
                { text: [ { text: 'Categoria: ', bold: true }, { text: team.teamName } ], style: 'tableRow' }
              ],
              [
                {
                  text    : [
                    { text: 'Descrizione: ', bold: true },
                    { text: training.trainingDescription, fontSize: 10 }
                  ], style: 'tableRow', colSpan: 2
                }, {}
              ],
              [
                {
                  text      : [
                    { text: 'Note: ', bold: true },
                    {
                      text    : training.trainingNotes,
                      fontSize: 10
                    }
                  ], colSpan: 2, style: 'tableRow'
                }, {}
              ],
              [
                {
                  text      : [
                    //TODO: Call api and retrieve all absent players
                    { text: 'Assenze (4): ', bold: true },
                    { text: '', fontSize: 10 }
                  ], colSpan: 2, style: 'tableRow'
                }, {}
              ],
              ...exercisesTableData
            ]
          }
        }
      ],
      styles     : {
        header      : {
          fontSize: 18,
          bold    : true,
          margin  : [ 0, 10, 0, 10 ]
        },
        tableExample: {
          margin    : [ 0, 5, 0, 15 ],
          lineHeight: 1
        },
        tableRow    : {
          margin: [ 0, 10, 0, 10 ]
        },
        tableHeader : {
          bold    : true,
          fontSize: 13,
          color   : 'black'
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
              [
                { text: 'Dirig. Accomp. Uff.', style: 'cellContentLight' },
                { text: '', fontSize: 9, color: '#0A0A0A' },
                {},
                {},
                {},
                {}
              ],
              [
                { text: 'Dirig. Addetto all\'arbitro', style: 'cellContentLight' },
                { text: '', fontSize: 9, color: '#0A0A0A' },
                {},
                {},
                {},
                {}
              ],
              [
                { text: 'Allenatore', style: 'cellContentLight' },
                { text: '', fontSize: 9, color: '#0A0A0A' },
                {},
                {},
                {},
                {}
              ],
              [
                { text: 'Allenatore in 2a', style: 'cellContentLight' },
                { text: '', fontSize: 9, color: '#0A0A0A' },
                {},
                {},
                {},
                {}
              ],
              [
                { text: 'Medico Sociale', style: 'cellContentLight' },
                { text: '', fontSize: 9, color: '#0A0A0A' },
                {},
                {},
                {},
                {}
              ],
              [
                { text: 'Massaggiatore', style: 'cellContentLight' },
                { text: '', fontSize: 9, color: '#0A0A0A' },
                {},
                {},
                {},
                {}
              ],
              [
                { text: 'Assistente dell\'arbitro', style: 'cellContentLight' },
                { text: '', fontSize: 9, color: '#0A0A0A' },
                {},
                {},
                {},
                {}
              ]
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

}
