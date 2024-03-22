import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { MaybeUser } from '../../database/models/MaybeUser/MaybeUser';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { AdminGuard } from '../auth/guards';
import { MaybeUsersService } from './maybe-users.service';


const parser = new MongooseQueryParser();

@ApiTags('MaybeUsers')
@Controller('maybe-users')
@UseInterceptors(HttpCacheInterceptor)
export class MaybeUsersController {

  constructor(
    private maybeUsersService: MaybeUsersService
  ) {
  }


  /**
   * Endpoint to insert a record in mongoDB Database
   * @param maybeUser
   */
  @Post('new-contact')
  @UseGuards(AdminGuard)
  public async insertNewMaybeUser(
    @Body() maybeUser: MaybeUser
  ) {
    return this.maybeUsersService.insertNewMaybeUser(maybeUser);
  }


}
