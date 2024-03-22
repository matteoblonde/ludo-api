import { Inject } from '@nestjs/common';
import MaybeUserModel, { MaybeUser } from '../../database/models/MaybeUser/MaybeUser';
import { getRequiredEnv } from '../../utils';
import { AbstractedCrudService } from '../abstractions/abstracted-crud.service';

import * as nodemailer from 'nodemailer';


export class MaybeUsersService extends AbstractedCrudService<MaybeUser> {

  constructor(
    @Inject(MaybeUserModel.collection.name)
    private readonly maybeUserModel: typeof MaybeUserModel
  ) {
    super(maybeUserModel);
  }


  /**
   * Insert new user into database
   * @param maybeUser
   */
  public async insertNewMaybeUser(maybeUser: MaybeUser) {

    /**
     * Build the final record
     */
    const record = new this.maybeUserModel(maybeUser);

    /* save the record, mongo.insertOne() */
    await record.save();

    /** Set the email config */
    const emailTransporter = nodemailer.createTransport({
      host  : getRequiredEnv('SMTP_HOST'),
      port  : 465,
      secure: true,
      auth  : {
        user: getRequiredEnv('SMTP_USER'),
        pass: getRequiredEnv('SMTP_PASSWORD')
      }
    });

    /** Send email to the user */
    await emailTransporter.sendMail({
      to     : maybeUser.email,
      from   : 'Ludo - Manage your Team <info@ludo-sport.com>',
      subject: 'Grazie per averci contattato',
      html   : `<!DOCTYPE html>
                  <html>
                  <head>
                    <style>
                      body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                      }
                      table {
                        border-spacing: 0;
                        border-collapse: collapse;
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                      }
                      td {
                        padding: 0;
                        mso-line-height-rule: exactly;
                      }
                      .container {
                        max-width: 600px;
                        background: white;
                        text-align: center;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      }
                      .header {
                        padding: 20px;
                        text-align: left;
                        border-radius: 8px 8px 0 0;
                      }
                      .content {
                        padding: 20px;
                        text-align: left;
                      }
                      .footer {
                        background-color: #f1f5f9;
                        color: #334155;
                        text-align: center;
                        padding: 10px;
                        font-size: 12px;
                      }
                      .button {
                        padding: 10px 20px;
                        color: white;
                        background-color: #10b981;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;
                      }
                    </style>
                  </head>
                  <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
                  <center>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 20px;">
                      <tr>
                        <td align="center" style="padding: 20px;">
                          <table role="presentation" class="container" style="max-width: 600px; margin: auto; background: white; text-align: center; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                            <tr>
                              <td class="header" style="padding: 20px; text-align: left; border-radius: 8px 8px 0 0;">
                                <img src="https://ludo-sport.s3.eu-central-1.amazonaws.com/app-settings/Logo.svg" alt="Ludo Sport" style="max-width: 50px; vertical-align: middle;">
                                <span style="display: inline; vertical-align: middle; font-size: 28px; margin-left: 10px; font-weight: bold;">Ludo</span>
                              </td>
                            </tr>
                            <tr>
                              <td class="content" style="padding: 20px; text-align: left;">
                                <h3>Ciao ${maybeUser.firstName} ${maybeUser.lastName}</h3>
                                <p>Grazie per aver mandato la richiesta di contatto a Ludo. <br /> Qualcuno del nostro team ti scriverà il prima possibile</p>
                              </td>
                            </tr>
                            <tr>
                              <td class="footer" style="background-color: #f1f5f9; color: #334155; text-align: center; padding: 10px; font-size: 12px;">
                                Grazie, <br> Ludo Team
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </center>
                  </body>
                  </html>
                  `
    });


    /** Send email to administrator */
    await emailTransporter.sendMail({
      to     : 'matteo.ballarini@icloud.com',
      from   : 'Ludo - Contatto <info@ludo-sport.com>',
      subject: 'Nuovo Contatto in Arrivo',
      html   : `<!DOCTYPE html>
                  <html lang="it">
                  <head>
                  <title></title>
                  </head>
                  <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
                  Ciao Admin, hai ricevuto una nuova richiesta di contatto da: ${maybeUser.firstName} ${maybeUser.lastName}. Qui di seguito tutte le sue informazioni: <br>
                  <span style="font-weight: bold">Nome: </span> ${maybeUser.firstName} <br>
                  <span style="font-weight: bold">Cognome: </span> ${maybeUser.lastName} <br>
                  <span style="font-weight: bold">Email: </span> ${maybeUser.email} <br>
                  <span style="font-weight: bold">Message: </span> ${maybeUser.message} <br> <br>
                  
                  Cerca di ricontattarlo il prima possibile!
                  </body>
                  </html>
                `
    });


    /* return created record */
    return record;

  }

}
