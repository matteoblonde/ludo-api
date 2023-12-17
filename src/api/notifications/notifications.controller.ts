import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { Notification } from '../../database/models/Notification/Notification';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { UserData } from '../auth/decorators';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { NotificationsService } from './notifications.service';


const parser = new MongooseQueryParser();

@ApiTags('Notifications')
@Controller('notifications')
@UseInterceptors(HttpCacheInterceptor)
export class NotificationsController {

  constructor(
    private notificationService: NotificationsService
  ) {
  }


  /**
   * Endpoint to insert a record in mongoDB Database
   * @param notification
   * @param userData
   */
  @UseGuards(AccessTokenGuard)
  @Post()
  public async insertNewNotification(
    @Body() notification: Notification,
    @UserData() userData: IUserData
  ) {
    return this.notificationService.insertNewNotification({
      teams : userData.teams,
      userId: userData.userId, ...notification
    });
  }


  /**
   * Endpoint to update one Notification into mongoDB Database
   * @param id
   * @param notification
   */
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  public async updateNotification(
    @Param('id') id: string,
    @Body() notification: Notification
  ) {

    return this.notificationService.updateOneNotification(id, notification);

  }


  /**
   * Endpoint to delete one Notification from mongoDB Database
   * @param id
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async deleteNotification(
    @Param('id') id: string
  ) {

    return this.notificationService.deleteNotification(id);

  }


  /**
   * Endpoint to dynamically query mongoDB Database
   * @param query
   * @param userData
   */
  @UseGuards(AccessTokenGuard)
  @Get()
  public async getNotifications(
    @Query() query: string,
    @UserData() userData: IUserData
  ) {
    return this.notificationService.get(userData.teams, parser.parse(query));
  }


}
