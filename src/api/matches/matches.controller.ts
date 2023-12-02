import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { Label } from '../../database/models/Label/Label';
import { Match } from '../../database/models/Match/Match';
import { Player } from '../../database/models/Player/Player';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';

import { UserData } from '../auth/decorators';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { MatchesService } from './matches.service';


const parser = new MongooseQueryParser();

@ApiTags('Matches')
@Controller('matches')
@UseInterceptors(HttpCacheInterceptor)
export class MatchesController {

  constructor(
    private matchesService: MatchesService
  ) {
  }


  /**
   * Endpoint to insert a record in mongoDB Database
   * @param match
   * @param userData
   */
  @UseGuards(AccessTokenGuard)
  @Post()
  public async insertNewMatch(
    @Body() match: Match,
    @UserData() userData: IUserData
  ) {
    return this.matchesService.insertNewMatch({ teams: userData.teams, userId: userData.userId, ...match });
  }


  /**
   * Endpoint to update one Match into mongoDB Database
   * @param id
   * @param match
   */
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  public async updateMatch(
    @Param('id') id: string,
    @Body() match: Match
  ) {

    return this.matchesService.updateOneMatch(id, match);

  }


  /**
   * Endpoint to update players array in the match
   * @param id
   * @param players
   */
  @UseGuards(AccessTokenGuard)
  @Patch('players/:id')
  public async updateMatchPlayers(
    @Param('id') id: string,
    @Body() players: Player[]
  ) {
    return this.matchesService.updateMatchPlayers(id, players);
  }


  /**
   * Update only labels array in the record
   * @param id
   * @param labels
   */
  @UseGuards(AccessTokenGuard)
  @Patch('labels/:id')
  public async updateMatchLabels(
    @Param('id') id: string,
    @Body() labels: Label[]
  ) {
    return this.matchesService.updateMatchLabels(id, labels);
  }


  /**
   * Endpoint to delete one Match from mongoDB Database
   * @param id
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async deleteMatch(
    @Param('id') id: string
  ) {

    return this.matchesService.deleteMatch(id);

  }


  /**
   * Endpoint to dynamically query mongoDB Database
   * @param query
   * @param userData
   */
  @UseGuards(AccessTokenGuard)
  @Get()
  public async getMatches(
    @Query() query: string,
    @UserData() userData: IUserData
  ) {
    return this.matchesService.getMatches(userData.teams, parser.parse(query));
  }


}
