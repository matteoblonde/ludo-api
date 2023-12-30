import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { signUpDatabaseConnection } from '../../database/database.providers';

import CompanyModel from '../../database/models/Company/Company';
import RoleModel from '../../database/models/Role/Role';
import RoleSchema from '../../database/models/Role/Role.Schema';
import TeamModel from '../../database/models/Team/Team';
import TeamSchema from '../../database/models/Team/Team.schema';
import UserModel from '../../database/models/User/User';
import { AccessTokenService } from '../../token/services/access-token.service';
import { RefreshTokenService } from '../../token/services/refresh-token.service';
import { getRequiredEnv } from '../../utils';


import type { UserLoginDto } from './dto/UserLoginDto';
import { UserSignUpDto } from './dto/UserSignUpDto';

import { InvalidCredentialsException } from './exceptions/InvalidCredentialsException';
import { UserNotFoundException } from './exceptions/UserNotFoundException';
import { IAuthData } from './interfaces/AuthData';

import type { IUserData } from './interfaces/UserData';


@Injectable()
export class AuthService {

  constructor(
    @Inject(UserModel.collection.name)
    private readonly User: typeof UserModel,
    @Inject(CompanyModel.collection.name)
    private readonly Company: typeof CompanyModel,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService
  ) {
  }


  /**
   * Starting from a valid UserData object, return the two signed tokens
   * @param userData
   */
  public createAuthData(userData: IUserData): IAuthData {
    return {
      accessToken : this.accessTokenService.sign(userData),
      refreshToken: this.refreshTokenService.sign(userData),
      userData
    };
  }


  /**
   * Sign a new AccessToken
   * @param userData
   */
  public grantAccessToken(userData: IUserData): { accessToken: string } {
    const accessToken = this.accessTokenService.sign(userData);
    return { accessToken: accessToken };
  }


  /**
   * Verify the user login data and return a proper IUserData object
   * @param loginDto
   */
  public async verifyLoginAsync(loginDto: UserLoginDto): Promise<IUserData> {
    /** Search the user into users */
    const privateUserData = await this.verifyLoginFromUserAsync(loginDto);

    /** If a private user has been found, return its minimal data */
    if (privateUserData) {
      return this.createUserData(
        privateUserData.username,
        privateUserData.company.toString(),
        privateUserData._id.toString(),
        privateUserData.role.roleLevel,
        privateUserData.teams
      );
    }

    // TODO: Verify authentication using different auth source

    /** If no valid authentication has been found, throw the final exception */
    throw new UserNotFoundException();
  }


  /**
   * Function to perform signUp on Invitation
   * @param newUser
   * @param userData
   */
  public async performSignUpInvitationAsync(newUser: any, userData: IUserData) {

    // TODO: Verify the email is unique and return exception
    const password = Math.random().toString(36).slice(-8);

    /** Create the user if random password */
    const user = new this.User({
      username: newUser.username,
      password: crypto.createHash('md5').update(password).digest('hex'),
      company : userData.company,
      role    : newUser.role
    });
    await user.save();

    /** Generate email with a link to the endpoint to complete registration */
    const emailTransporter = nodemailer.createTransport({
      host  : getRequiredEnv('SMTP_HOST'),
      port  : 465,
      secure: true,
      auth  : {
        user: getRequiredEnv('SMTP_USER'),
        pass: getRequiredEnv('SMTP_PASSWORD')
      }
    });

    await emailTransporter.sendMail({
      to     : user.username,
      from   : 'Ludo - Manage your Team <info@ludo-sport.com>',
      subject: 'Welcome to Ludo',
      html   : `<!DOCTYPE html>
                <html lang="it">
                <head>
                  <style>
                    /* Stili base */
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
                      width: 100%;
                      max-width: 600px;
                      margin: auto;
                      background: white;
                      text-align: center;
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
                    .password {
                      padding: 10px 15px;
                      background-color: #f1f5f9;
                      border-radius: 5px;
                      display: inline-block;
                      margin: 15px 0;
                    }
                  </style><title>Ludo - Manage your Team</title>
                  <!--[if mso]>
                  <style type="text/css">
                    .content {text-align: left; text-justify: inter-word;}
                  </style>
                  <![endif]-->
                </head>
                <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                <center>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding: 20px;">
                        <table role="presentation" class="container" style="width: 100%; max-width: 600px; margin: auto; background: white; text-align: center; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                          <tr>
                            <td class="header" style="padding: 20px; text-align: left; border-radius: 8px 8px 0 0;">
                              <img src="https://ludo-sport.s3.eu-central-1.amazonaws.com/app-settings/Logo.png" alt="Logo Ludo" style="max-width: 50px; vertical-align: middle;" role="presentation" aria-hidden="true">
                              <span style="display: inline; vertical-align: middle; font-size: 28px; margin-left: 10px; font-weight: bold;">Benvenuto in Ludo!</span>
                            </td>
                          </tr>
                          <tr>
                            <td class="content" style="padding: 20px; text-align: left;">
                              <h2>Ciao ${user.username}!</h2>
                              <p>Sei stato invitato a unirti a Ludo! Qui di seguito i dettagli di accesso ed un link per verificare il tuo indirizzo email.</p>
                              <p>La tua password:</p>
                              <div class="password" style="padding: 10px 15px; background-color: #f1f5f9; border-radius: 5px; display: inline-block; margin: 15px 0;">${password}</div>
                              <p>Per iniziare ad utilizzare Ludo, per favore conferma il tuo indirizzo mail cliccando sul pulsante qui sotto.</p>
                              <a href="https://api.ludo-sport.com/auth/registration-complete/${user._id}/${userData.company}/true" target="_blank" class="button" style="padding: 10px 20px; color: white; background-color: #10b981; text-decoration: none; border-radius: 5px; display: inline-block;">Verifica Email</a>
                              <p style="font-size: 14px">Se non ti aspettavi questo invito, ignora questa email.</p>
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

    /** Return user */
    return password;
  }


  /**
   * Function to perform standard signUp
   * @param signUpDto
   */
  public async performSignUpAsync(signUpDto: UserSignUpDto) {

    /** Create the company */
    const company = new this.Company({
      companyName: signUpDto.companyName
    });
    await company.save();

    /** Create the user */
    const user = new this.User({
      username: signUpDto.username,
      password: crypto.createHash('md5').update(signUpDto.password).digest('hex'),
      company : company._id,
      role    : { roleLevel: 100 },
      teams   : []
    });
    await user.save();

    const emailTransporter = nodemailer.createTransport({
      host  : getRequiredEnv('SMTP_HOST'),
      port  : 465,
      secure: true,
      auth  : {
        user: getRequiredEnv('SMTP_USER'),
        pass: getRequiredEnv('SMTP_PASSWORD')
      }

    });

    // TODO: Create html file with the code and beautify the message
    await emailTransporter.sendMail({
      to     : user.username,
      from   : 'Ludo - Manage your Team <info@ludo-sport.com>',
      subject: 'Welcome to Ludo',
      html   : `<!DOCTYPE html>
              <html lang="it">
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
                </style><title>Ludo - Manage your Team</title>
                <!--[if mso]>
                <style type="text/css">
                  .content {text-align: left; text-justify: inter-word;}
                </style>
                <![endif]-->
              </head>
              <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
              <center>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 20px;">
                  <tr>
                    <td align="center" style="padding: 20px;">
                      <table role="presentation" class="container" style="max-width: 600px; margin: auto; background: white; text-align: center; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <tr>
                          <td class="header" style="padding: 20px; text-align: left; border-radius: 8px 8px 0 0;">
                            <img src="https://ludo-sport.s3.eu-central-1.amazonaws.com/app-settings/Logo.png" alt="Ludo Sport" style="max-width: 50px; vertical-align: middle;" role="presentation" aria-hidden="true">
                            <span style="display: inline; vertical-align: middle; font-size: 28px; margin-left: 10px; font-weight: bold;">Benvenuto in Ludo!</span>
                          </td>
                        </tr>
                        <tr>
                          <td class="content" style="padding: 20px; text-align: left;">
                            <h3>Ciao ${signUpDto.username}</h3>
                            <p>Grazie per esserti registrato a Ludo. <br /> Per iniziare ad utilizzare Ludo, per favore conferma il tuo indirizzo mail cliccando sul pulsante qui sotto.</p>
                            <a href="https://api.ludo-sport.com/auth/registration-complete/${user._id}/${company._id}/false" target="_blank" class="button" style="padding: 10px 20px; color: white; background-color: #10b981; text-decoration: none; border-radius: 5px; display: inline-block;">Verifica Email</a>
                            <p style="font-size: 14px">Se non ti sei registrato a Ludo, ignora questa email.</p>
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

    return this.createAuthData({
      username : signUpDto.username,
      company  : company._id.toString(),
      userId   : user._id.toString(),
      roleLevel: user.role.roleLevel,
      teams    : user.teams
    });

  }


  /**
   * Verify the registration completed after clicked the button on the email
   * @param userId
   * @param companyId
   * @param invitation
   */
  public async verifyRegistrationCompleted(userId: string, companyId: string, invitation: boolean) {

    /** Verify the company */
    const company = await this.Company.findById(companyId).exec();

    /** Verify the user */
    const userExist = await this.User.findByIdAndUpdate(userId, { emailVerified: true });

    /** If both exist create first standard settings (Role, Teams...) */
    if (company && userExist && !invitation) {

      // TODO: Bug duplicate roles and teams creation
      /** Inject new connection and models */
      const signUpConnection = await signUpDatabaseConnection(company._id.toString());
      const roleModel = signUpConnection.model(RoleModel.collection.name, RoleSchema);
      const teamModel = signUpConnection.model(TeamModel.collection.name, TeamSchema);

      /** Check if 'Admin' role already exists */
      let role = await roleModel.findOne({ roleName: 'Admin' });
      if (!role) {
        /** Initialize the first role */
        role = new roleModel({
          roleName : 'Admin',
          roleLevel: 100
        });
        await role.save();
      }

      /** Check if team with the company name already exists */
      let team = await teamModel.findOne({ teamName: company.companyName });
      if (!team) {
        /** Initialize the first Team, with the same name of the company */
        team = new teamModel({
          teamName: company.companyName
        });
        await team.save();
      }

      /** Save and return the modified user */
      return this.User.findByIdAndUpdate(userId, {
        teams: [ team._id ],
        role : role
      });

    }

    /** Return user if both exist */
    return userExist;

  }


  /**
   * Search for a user using the collection for private user login
   * @param loginDto
   * @private
   */
  private async verifyLoginFromUserAsync(loginDto: UserLoginDto) {
    /** Search the user using provided data into Users collection */
    const maybeUser = await this.User
      .findOne({ username: loginDto.username })
      .lean();

    /** If no user has been found, could exit */
    if (!maybeUser) {
      return null;
    }

    /** Hash the provided password using MD5 hash */
    const passwordHash: string = crypto.createHash('md5')
      .update(loginDto.password)
      .digest('hex');


    /** Assert the passwords are the same */
    if (passwordHash !== maybeUser.password) {
      throw new InvalidCredentialsException();
    }

    /** Return the found user */
    return maybeUser;
  }


  /**
   * Starting from an id, search into all auth sources to get the right UserData object
   * @param id
   * @private
   */
  public async getUserByIdAsync(id: string): Promise<IUserData | null> {
    /** Search the user into Database */
    const privateUserData = await this.User.findById(id).exec();

    /** If a private user has been found, return its minimal data */
    if (privateUserData) {
      return this.createUserData(
        privateUserData.username,
        privateUserData.company.toString(),
        privateUserData._id.toString(),
        privateUserData.role.roleLevel,
        privateUserData.teams
      );
    }

    /** Fallback to null */
    return null;
  }


  public async getRoleByIdAsync(id: string): Promise<any> {

  }


  /**
   * Starting from any of the defined authorization sources,
   * extract relevant data and return a unique UserData interface
   * @private
   * @param username
   * @param company
   * @param userId
   * @param roleLevel
   * @param teams
   */
  private createUserData(
    username: string,
    company: string,
    userId: string,
    roleLevel: number,
    teams: string[]
  ): IUserData {
    return {
      username,
      company  : company,
      userId   : userId,
      roleLevel: roleLevel,
      teams    : teams
    };
  }

}
