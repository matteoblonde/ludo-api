import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Error } from 'mongoose';
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

    await emailTransporter.sendMail({
      to     : user.username,
      from   : 'Ludo Sport <info@ludo-sport.com>',
      subject: 'Welcome to Ludo',
      html   : `<!DOCTYPE html>
                  <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <title>Welcome to Ludo</title>
                    <style>
                      .container {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                      }
                      body {
                        background-color: #1d1e27;
                        color: #ecfdf5;
                        padding: 2rem;
                        font-size: 1.25rem;
                      }
                      button {
                        padding: 0.75rem;
                        background-color: #10b981;
                        color: #ecfdf5;
                        border: none;
                        border-radius: 5px;
                        font-size: 1.25rem;
                        margin: 1rem 0;
                      }
                      button:hover {
                        background-color: #0fb07b;
                        cursor: pointer;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <img alt="Ludo Sport" src="https://ludo-sport.s3.eu-central-1.amazonaws.com/app-settings/Logo_Text_Tr.png" style="width: 15rem; margin-bottom: 2rem">
                      <span>Hi ${user.username}, <br /> We're happy you signed up for Ludo.<br /> <br />To start exploring Ludo App please confirm your email address by pressing the button <br /> <a href="https://api.ludo-sport.com/auth/registration-complete/${user._id}/${company._id}" target="_blank"><button>Verify Now</button></a> <br /> <br /> Welcome to Ludo! <br> Ludo Team</span>
                    </div>
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
   */
  public async verifyRegistrationCompleted(userId: string, companyId: string) {

    /** Verify the company */
    const company = await this.Company.findById(companyId).exec();


    /** Verify the user */
    const userExist = await this.User.findByIdAndUpdate(userId, { emailVerified: true });

    /** If both exist create first standard settings (Role, Teams...) */
    if (company && userExist) {

      /** Inject new connection and models */
      const signUpConnection = await signUpDatabaseConnection(company._id.toString());
      const roleModel = signUpConnection.model(RoleModel.collection.name, RoleSchema);
      const teamModel = signUpConnection.model(TeamModel.collection.name, TeamSchema);

      /** Initialize the first role */
      const role = new roleModel({
        roleName : 'Admin',
        roleLevel: 100
      });
      await role.save();

      /** Initialize the first Team, with the same name of the company */
      const team = new teamModel({
        teamName: company.companyName,
        users   : [ userExist ]
      });
      await team.save();

      /** Save and return the modified user */
      return this.User.findByIdAndUpdate(userId, {
        teams: [ team._id ],
        role : role
      });

    }

    /** return user if both exist */
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
