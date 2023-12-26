import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Player } from '../../database/models/Player/Player';
import { PlayerAttribute } from '../../database/models/PlayerAttribute/PlayerAttribute';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { UserData } from '../auth/decorators';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { PlayersService } from './players.service';


@ApiTags('Players')
@Controller(':collection')
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
  @Post('insert-player')
  public async insertNewPlayer(
    @Body() player: Player,
    @UserData() userData: IUserData
  ) {
    return this.playersService.insertNewPlayer({ teams: userData.teams, userId: userData.userId, ...player });
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
    @Body() stats: PlayerAttribute[]
  ) {

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


}
