import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Training } from '../../database/models/Training/Training';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { UserData } from '../auth/decorators';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { TrainingsService } from './trainings.service';


@ApiTags('Trainings')
@Controller(':collection')
@UseInterceptors(HttpCacheInterceptor)
export class TrainingsController {

  constructor(
    private trainingsService: TrainingsService
  ) {
  }


  /**
   * Endpoint to insert a record in mongoDB Database
   * @param training
   * @param userData
   */
  @UseGuards(AccessTokenGuard)
  @Post('insert-training')
  public async insertNewTraining(
    @Body() training: Training,
    @UserData() userData: IUserData
  ) {
    return this.trainingsService.insertNewTraining({ teams: userData.teams, userId: userData.userId, ...training });
  }


}
