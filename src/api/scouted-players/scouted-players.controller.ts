import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScoutedPlayer } from '../../database/models/ScoutedPlayer/ScoutedPlayer';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { UserData } from '../auth/decorators';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { ScoutedPlayersService } from './scouted-players.service';


@ApiTags('Scouted Players')
@Controller(':collection')
@UseInterceptors(HttpCacheInterceptor)
export class ScoutedPlayersController {

  constructor(
    private scoutedPlayersService: ScoutedPlayersService
  ) {
  }


  /**
   * Endpoint to insert a record in mongoDB Database
   * @param scoutedPlayer
   * @param userData
   */
  @UseGuards(AccessTokenGuard)
  @Post('insert-scouted-player')
  public async insertNewPlayer(
    @Body() scoutedPlayer: ScoutedPlayer,
    @UserData() userData: IUserData
  ) {
    return this.scoutedPlayersService.insertNewScoutedPlayer({ userId: userData.userId, ...scoutedPlayer });
  }


  /**
   * Update attribute value for a player
   *
   * @param {string} playerId - The ID of the player
   * @param {string} attributeId - The ID of the attribute to be updated
   * @param {PlayerAttribute} attribute - The new attribute value
   * @returns {Promise<void>} - The updated player attribute
   *
   */
  /*  @UseGuards(AccessTokenGuard)
    @Patch(':playerId/:attributeId')
    public async updatePlayerAttribute(
      @Param('playerId') playerId: string,
      @Param('attributeId') attributeId: string,
      @Body() attribute: PlayerAttribute
    ): Promise<void> {
      return this.scoutedPlayersService.updatePlayerAttributeValue(playerId, attributeId, attribute);
    }*/


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
  /*  @UseGuards(AccessTokenGuard)
    @Get('total-stats/:id')
    public async updatePlayerTotalStats(
      @Param('id') id: string
    ): Promise<any> {
      return this.scoutedPlayersService.updatePlayerTotalStats(id);
    }*/


}
