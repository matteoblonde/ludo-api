import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { PlayerStat } from '../../database/models/PlayerStat/PlayerStat';
import { AccessTokenGuard } from '../auth/guards';
import { PlayerStatsService } from './player-stats.service';


const parser = new MongooseQueryParser();

@ApiTags('PlayerStats')
@Controller('player-stats')
export class PlayerStatsController {

  constructor(
    private playerStatsService: PlayerStatsService
  ) {
  }


  /**
   * Endpoint to insert a record in mongoDB Database
   * @param playerStat
   */
  @UseGuards(AccessTokenGuard)
  @Post()
  public async insertNewPlayerStat(
    @Body() playerStat: PlayerStat
  ) {
    return this.playerStatsService.insertNewPlayerStat(playerStat);
  }


  /**
   * Endpoint to update one player stat into mongoDB Database
   * @param id
   * @param playerStat
   */
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  public async updatePlayerStat(
    @Param('id') id: string,
    @Body() playerStat: PlayerStat
  ) {

    return this.playerStatsService.updateOnePlayerStat(id, playerStat);

  }


  /**
   * Endpoint to delete one player stat from mongoDB Database
   * @param id
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async deletePlayerStat(
    @Param('id') id: string
  ) {

    return this.playerStatsService.deletePlayerStat(id);

  }


  /**
   * Endpoint to dynamically query mongoDB Database
   * @param query
   */
  @UseGuards(AccessTokenGuard)
  @Get()
  public async getPlayerStat(
    @Query() query: string
  ) {
    return this.playerStatsService.getPlayerStat(parser.parse(query));
  }


}
