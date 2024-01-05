import {
  BadRequestException,
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
import { User } from '../../database/models/User/User';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { UserData } from '../auth/decorators';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { UsersService } from './users.service';


const parser = new MongooseQueryParser();

@ApiTags('Users')
@Controller('users')
@UseInterceptors(HttpCacheInterceptor)
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
  @UseGuards(AccessTokenGuard)
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
   * @param userData
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async deleteUser(
    @Param('id') id: string,
    @UserData() userData: IUserData
  ) {

    /** Check if the role permit this operation */
    if (userData.roleLevel < 90) {
      throw new BadRequestException('The user does not have permission to delete a user');
    }
    return this.usersService.deleteUser(id);

  }


  /**
   * Endpoint to dynamically query mongoDB Database
   * @param query
   */
  @UseGuards(AccessTokenGuard)
  @Get()
  public async getUsers(
    @Query() query: string
  ) {
    return this.usersService.get([], parser.parse(query));
  }


}
