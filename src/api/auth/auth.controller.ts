import { Body, Controller, Get, Param, Post, Redirect, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { response } from 'express';
import user from '../../database/models/User/User';

import { AuthService } from './auth.service';

import { UserLoginDto } from './dto/UserLoginDto';

import { UserData } from './decorators';
import { UserSignUpDto } from './dto/UserSignUpDto';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';
import { IUserData } from './interfaces/UserData';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {
  }


  /**
   * Endpoint for Login to generate Access and Refresh Token
   *
   * @param loginDto
   */
  @ApiCreatedResponse({ description: 'JSON Object with: accessToken, refreshToken and userData' })
  @ApiResponse({ description: 'Could not find a valid user with provided email', status: 401 })
  @Post('login')
  public async login(
    @Body() loginDto: UserLoginDto
  ) {
    const userData = await this.authService.verifyLoginAsync(loginDto);
    return this.authService.createAuthData(userData);
  }


  @Post('signup')
  public async signUp(
    @Body() signUpDto: UserSignUpDto
  ) {
    return this.authService.performSignUpAsync(signUpDto);
  }


  @Redirect()
  @Get('registration-complete/:user/:company')
  public async registrationComplete(
    @Param('user') userId: string,
    @Param('company') companyId: string
  ) {

    const verified = await this.authService.verifyRegistrationCompleted(userId, companyId);

    if (verified) {
      const userData = {
        username: verified.username,
        company : verified.company.toString(),
        userId  : verified._id.toString()
      };
      const { refreshToken } = this.authService.createAuthData(userData);
      const url = `http://localhost:4200/dashboard?refresh_token=${refreshToken}`;

      return verified ? { statusCode: 301, url } : false;
    }

    return false;

  }


  @UseGuards(AccessTokenGuard)
  @Get('me')
  public getUserData(
    @UserData() userData: IUserData
  ) {
    return userData;
  }


  @UseGuards(RefreshTokenGuard)
  @Get('grant')
  public grantAccessToken(
    @UserData() userData: IUserData
  ) {
    return this.authService.grantAccessToken(userData);
  }

}
