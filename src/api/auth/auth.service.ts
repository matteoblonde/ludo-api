import * as crypto from 'crypto';

import { Injectable, Inject } from '@nestjs/common';
import UserModel from '../../database/models/User/User';


import type { UserLoginDto } from './dto/UserLoginDto';

import { InvalidCredentialsException } from './exceptions/InvalidCredentialsException';
import { UserNotFoundException } from './exceptions/UserNotFoundException';

import type { IUserData } from './interfaces/UserData';
import { AccessTokenService } from '../../token/services/access-token.service';
import { RefreshTokenService } from '../../token/services/refresh-token.service';
import { IAuthData } from './interfaces/AuthData';


@Injectable()
export class AuthService {

  constructor(
    @Inject(UserModel.collection.name)
    private readonly User: typeof UserModel,
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
        privateUserData._id.toString()
      );
    }

    // TODO: Verify authentication using different auth source

    /** If no valid authentication has been found, throw the final exception */
    throw new UserNotFoundException();
  }


  /**
   * Search for a user using the IndirizziRubrica collection for private user login
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
    /*const passwordHash = crypto.createHash('md5').update(loginDto.password).digest('hex');*/
    const passwordHash: string = loginDto.password;

    /** Assert the passwords are the same */
    /*if (passwordHash.toUpperCase() !== maybeUser.PasswordWeb.toUpperCase()) {
      throw new InvalidCredentialsException();
    }*/
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
  public async getByIdAsync(id: string): Promise<IUserData | null> {
    /** Search the user into IndirizziRubrica */
    const privateUserData = await this.getByIdFromUsersAsync(id);

    /** If a private user has been found, return its minimal data */
    if (privateUserData) {
      return this.createUserData(
        privateUserData.username,
        privateUserData.company.toString(),
        privateUserData._id.toString()
      );
    }

    /** Fallback to null */
    return null;
  }


  private async getByIdFromUsersAsync(id: string) {
    return this.User.findById(id).exec();
  }


  /**
   * Starting from any of the defined authorization sources,
   * extract relevant data and return a unique UserData interface
   * @private
   * @param username
   * @param company
   * @param userId
   */
  private createUserData(
    username: string,
    company: string,
    userId: string
  ): IUserData {
    return {
      username,
      company: company,
      userId : userId
    };
  }

}
