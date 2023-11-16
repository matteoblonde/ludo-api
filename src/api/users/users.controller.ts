import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { User } from '../../database/models/User/User';
import { AccessTokenGuard } from '../auth/guards';
import { UsersService } from './users.service';


const parser = new MongooseQueryParser();

@ApiTags('Users')
@Controller('users')
export class UsersController {

  constructor(
    private usersService: UsersService
  ) {
  }


  //TODO: Definire se utilizzare una sicurezza per le chiamate di creazione company e user, oppure come fare?
  /**
   * Endpoint to insert a record in mongoDB Database
   * @param user
   */
  @Post()
  public async insertNewUser(
    @Body() user: User
  ) {
    return this.usersService.insertNewUser(user);
  }


  /**
   * Endpoint to update one record into mongoDB Database
   * @param id
   * @param user
   */
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  public async updateUser(
    @Param('id') id: string,
    @Body() user: User
  ) {

    return this.usersService.updateOneUser(id, user);

  }


  /**
   * Endpoint to delete one record from mongoDB Database
   * @param id
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async deleteUser(
    @Param('id') id: string
  ) {

    return this.usersService.deleteUser(id);

  }


  /**
   * Endpoint to dynamically query mongoDB Database
   * @param query
   */
  @Get()
  public async getUsers(
    @Query() query: string
  ) {
    return this.usersService.getUsers(parser.parse(query));
  }


}
