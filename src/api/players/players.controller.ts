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
import { Player } from '../../database/models/Player/Player';
import { PlayerStat } from '../../database/models/PlayerStat/PlayerStat';
import user from '../../database/models/User/User';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { UserData } from '../auth/decorators';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { PlayersService } from './players.service';


const parser = new MongooseQueryParser();

@ApiTags('Players')
@Controller('players')
@UseInterceptors(HttpCacheInterceptor)
export class PlayersController {

  constructor(
    private playersService: PlayersService
  ) {
  }


  /**
   * Endpoint to insert a record in mongoDB Database
   * @param player
   * @param userData
   */
  @UseGuards(AccessTokenGuard)
  @Post()
  public async insertNewPlayer(
    @Body() player: Player,
    @UserData() userData: IUserData
  ) {
    return this.playersService.insertNewPlayer({ teams: userData.teams, userId: userData.userId, ...player });
  }


  /**
   * Endpoint to update one Exercise into mongoDB Database
   * @param id
   * @param player
   */
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  public async updatePlayer(
    @Param('id') id: string,
    @Body() player: Player
  ) {

    return this.playersService.updateOnePlayer(id, player);

  }


  /**
   * Function to update only stats in the record
   * @param id
   * @param stats
   */
  @UseGuards(AccessTokenGuard)
  @Patch('stats/:id')
  public async updateStatsPlayer(
    @Param('id') id: string,
    @Body() stats: PlayerStat[]
  ) {

  }


  /**
   * Update only labels array in the record
   * @param id
   * @param labels
   */
  @UseGuards(AccessTokenGuard)
  @Patch('labels/:id')
  public async updatePlayerLabels(
    @Param('id') id: string,
    @Body() labels: Label[]
  ) {
    return this.playersService.updatePlayerLabels(id, labels);
  }


  /**
   * Updates the total stats of a player.
   *
   * @param {string} id - The ID of the player.
   * @returns {Promise<any>} - A promise that resolves with the updated player total stats.
   *
   * @UseGuards(AccessTokenGuard)
   * @Patch('total-stats/:id')
   * public async updatePlayerTotalStats(
   * ): Promise<any> {
   *    return this.playersService.updatePlayerTotalStats(id);
   * }
   */
  @UseGuards(AccessTokenGuard)
  @Get('total-stats/:id')
  public async updatePlayerTotalStats(
    @Param('id') id: string
  ): Promise<any> {
    return this.playersService.updatePlayerTotalStats(id);
  }


  /**
   * Endpoint to delete one Exercise from mongoDB Database
   * @param id
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async deletePlayer(
    @Param('id') id: string
  ) {

    return this.playersService.deletePlayer(id);

  }


  /**
   * Endpoint to dynamically query mongoDB Database
   * @param query
   * @param userData
   */
  @UseGuards(AccessTokenGuard)
  @Get()
  public async getPlayers(
    @Query() query: string,
    @UserData() userData: IUserData
  ) {
    
    return this.playersService.get(userData.teams, parser.parse(query));
  }


}
