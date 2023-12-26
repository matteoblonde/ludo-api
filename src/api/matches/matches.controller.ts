import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Player } from '../../database/models/Player/Player';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';

import { AccessTokenGuard } from '../auth/guards';
import { MatchesService } from './matches.service';


@ApiTags('Matches')
@Controller(':collection')
@UseInterceptors(HttpCacheInterceptor)
export class MatchesController {

  constructor(
    private matchesService: MatchesService
  ) {
  }


  /**
   * Endpoint to update players array in the match
   *
   * @param {string} id - The ID of the match to update
   * @param {Player[]} players - The updated players array
   *
   * @return {Promise<void>} - Returns a Promise that resolves to void
   */
  @UseGuards(AccessTokenGuard)
  @Patch('players/:id')
  public async updateMatchPlayers(
    @Param('id') id: string,
    @Body() players: Player[]
  ): Promise<void> {
    return this.matchesService.updateMatchPlayers(id, players);
  }


  /**
   * Updates a single player in a match.
   *
   * @param {string} matchId - The ID of the match.
   * @param {string} playerId - The ID of the player.
   * @param {Player} player - The updated player object.
   * @returns {Promise<any>} - A Promise that resolves to the updated match with the updated player.
   *
   * @UseGuards(AccessTokenGuard)
   * @Patch(':matchId/players/:playerId')
   */
  @UseGuards(AccessTokenGuard)
  @Patch(':matchId/player/:playerId')
  public async updateMatchSinglePlayer(
    @Param('matchId') matchId: string,
    @Param('playerId') playerId: string,
    @Body() player: Player
  ): Promise<any> {
    return this.matchesService.updateMatchSinglePlayer(matchId, playerId, player);
  }


  /**
   * Endpoint to delete one Match from mongoDB Database
   * @param id
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id/delete')
  public async deleteMatch(
    @Param('id') id: string
  ) {

    return this.matchesService.deleteMatch(id);

  }


}
