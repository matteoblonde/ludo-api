import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { Player } from '../../database/models/Player/Player';
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

    return this.playersService.getPlayers(userData.teams, parser.parse(query));
  }


}
