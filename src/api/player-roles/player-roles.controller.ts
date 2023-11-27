import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { PlayerRole } from '../../database/models/PlayerRole/PlayerRole';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { AccessTokenGuard } from '../auth/guards';
import { PlayerRolesService } from './player-roles.service';


const parser = new MongooseQueryParser();

@ApiTags('PlayerRoles')
@Controller('player-roles')
@UseInterceptors(HttpCacheInterceptor)
export class PlayerRolesController {

  constructor(
    private playerRolesService: PlayerRolesService
  ) {
  }


  /**
   * Endpoint to insert a record in mongoDB Database
   * @param playerRole
   */
  @UseGuards(AccessTokenGuard)
  @Post()
  public async insertNewPlayerRole(
    @Body() playerRole: PlayerRole
  ) {
    return this.playerRolesService.insertNewPlayerRole(playerRole);
  }


  /**
   * Endpoint to update one player role into mongoDB Database
   * @param id
   * @param playerRole
   */
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  public async updatePlayerRole(
    @Param('id') id: string,
    @Body() playerRole: PlayerRole
  ) {

    return this.playerRolesService.updateOnePlayerRole(id, playerRole);

  }


  /**
   * Endpoint to delete one player role from mongoDB Database
   * @param id
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async deletePlayerRole(
    @Param('id') id: string
  ) {

    return this.playerRolesService.deletePlayerRole(id);

  }


  /**
   * Endpoint to dynamically query mongoDB Database
   * @param query
   */
  @UseGuards(AccessTokenGuard)
  @Get()
  public async getPlayerRole(
    @Query() query: string
  ) {
    return this.playerRolesService.getPlayerRole(parser.parse(query));
  }


}
