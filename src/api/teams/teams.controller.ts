import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { Team } from '../../database/models/Team/Team';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { UserData } from '../auth/decorators';

import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { TeamsService } from './teams.service';


const parser = new MongooseQueryParser();

@ApiTags('Teams')
@Controller('teams')
@UseInterceptors(HttpCacheInterceptor)
export class TeamsController {

  constructor(
    private teamsService: TeamsService
  ) {
  }


  /**
   * Endpoint to insert a record in mongoDB Database
   * @param team
   */
  @UseGuards(AccessTokenGuard)
  @Post()
  public async insertNewTeam(
    @Body() team: Team
  ) {
    return this.teamsService.insertNewTeam(team);
  }


  /**
   * Endpoint to update one Team into mongoDB Database
   * @param id
   * @param team
   */
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  public async updateTeam(
    @Param('id') id: string,
    @Body() team: Team
  ) {

    return this.teamsService.updateOneTeam(id, team);

  }


  /**
   * Endpoint to delete one Team from mongoDB Database
   * @param id
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async deleteTeam(
    @Param('id') id: string
  ) {

    return this.teamsService.deleteTeam(id);

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


  /**
   * Endpoint to dynamically query mongoDB Database
   * @param query
   */
  @UseGuards(AccessTokenGuard)
  @Get()
  public async getTeams(
    @Query() query: string
  ) {
    return this.teamsService.get([], parser.parse(query));
  }


}
