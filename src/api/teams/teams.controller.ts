import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { UserData } from '../auth/decorators';

import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { TeamsService } from './teams.service';


@ApiTags('Teams')
@Controller(':collection')
@UseInterceptors(HttpCacheInterceptor)
export class TeamsController {

  constructor(
    private teamsService: TeamsService
  ) {
  }


  /**
   * Retrieves the teams associated with the user.
   *
   * @param {IUserData} userData - The user data object containing the user ID.
   * @returns {Promise<any>} The teams associated with the user.
   *
   * @useguards AccessTokenGuard
   * @get user
   */
  @UseGuards(AccessTokenGuard)
  @Get('user')
  public async getUserTeams(
    @UserData() userData: IUserData
  ): Promise<any> {
    return this.teamsService.getUserTeams(userData.userId);
  }


}
