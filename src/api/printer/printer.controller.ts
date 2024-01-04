import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserData } from '../auth/decorators';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { PrinterService } from './printer.service';

import { Response } from 'express';


@ApiTags('Printer')
@Controller('printer')
export class PrinterController {

  constructor(
    private printerService: PrinterService
  ) {
  }


  /**
   * Generates a PDF file for match convocation.
   * Requires an access token for authentication.
   *
   * @param {string} matchId - The ID of the match.
   * @param {IUserData} userData - The user data.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} - A promise that resolves once the PDF file has been generated and sent as a response.
   *
   * @example
   * // Example usage:
   * const matchId = '123';
   * const userData = {
   *   company: 'ABC Company'
   * };
   * const res = createResponseObject();
   * await generateMatchConvocationPdf(matchId, userData, res);
   */
  @UseGuards(AccessTokenGuard)
  @Get('matches/:matchId/convocation')
  public async generateMatchConvocationPdf(
    @Param('matchId') matchId: string,
    @UserData() userData: IUserData,
    @Res() res: Response
  ): Promise<void> {

    const pdfBuffer = await this.printerService.generateMatchConvocationPdf(matchId, userData.company);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=convocation.pdf');
    res.send(pdfBuffer);

  }


  /**
   * Generates a PDF document for a single training.
   *
   * @param trainingId - The ID of the training.
   * @param userData - The user data containing the company information.
   * @param res - The response object to send the PDF document.
   * @returns - None.
   *
   * @UseGuards(AccessTokenGuard)
   * @Get('trainings/:trainingId/single')
   */
  @UseGuards(AccessTokenGuard)
  @Get('trainings/:trainingId/single')
  public async generateTrainingPdf(
    @Param('trainingId') trainingId: string,
    @UserData() userData: IUserData,
    @Res() res: Response
  ): Promise<void> {
    const pdfBuffer = await this.printerService.generateTrainingPdf(trainingId, userData.company);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=training.pdf');
    res.send(pdfBuffer);
  }


  /**
   * Generates a PDF team list for a specific match.
   *
   * @param {string} matchId - The match ID.
   * @param userData
   * @param {object} res - The HTTP response object.
   *
   * @returns {Promise<void>} - A Promise that resolves when the PDF is generated and sent in the response.
   *
   * @example
   * generateTeamListPdf('123456', res)
   *   .then(() => {
   *     // PDF generated and sent in the response
   *   })
   *   .catch((error) => {
   *     // Error handling
   *   })
   */
  @UseGuards(AccessTokenGuard)
  @Get('matches/:matchId/team-list')
  public async generateTeamListPdf(
    @Param('matchId') matchId: string,
    @UserData() userData: IUserData,
    @Res() res: Response
  ): Promise<void> {
    const pdfBuffer = await this.printerService.generateTeamListPdf(matchId, userData.company);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=team-list.pdf');
    res.send(pdfBuffer);
  }


  /**
   * Generates a PDF match report for a given match ID and user data.
   *
   * @param {string} matchId - The ID of the match.
   * @param {IUserData} userData - The user data.
   * @param {Response} res - The HTTP response object.
   * @returns {Promise<void>} - A promise that resolves when the PDF is generated and sent as a response.
   *
   * @UseGuards(AccessTokenGuard)
   * @Get('matches/:matchId/report')
   * public async generateMatchReportPdf(
   *   @UserData() userData: IUserData,
   *   @Res() res: Response
   * )
   */
  @UseGuards(AccessTokenGuard)
  @Get('matches/:matchId/report')
  public async generateMatchReportPdf(
    @Param('matchId') matchId: string,
    @UserData() userData: IUserData,
    @Res() res: Response
  ): Promise<void> {
    const pdfBuffer = await this.printerService.generateMatchReportPdf(matchId, userData.company);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=match-report.pdf');
    res.send(pdfBuffer);
  }

}
