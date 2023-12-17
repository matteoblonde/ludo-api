import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { Label } from '../../database/models/Label/Label';
import { Training } from '../../database/models/Training/Training';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { UserData } from '../auth/decorators';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { TrainingsService } from './trainings.service';


const parser = new MongooseQueryParser();

@ApiTags('Trainings')
@Controller('trainings')
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
  @Post()
  public async insertNewTraining(
    @Body() training: Training,
    @UserData() userData: IUserData
  ) {
    return this.trainingsService.insertNewTraining({ teams: userData.teams, userId: userData.userId, ...training });
  }


  /**
   * Endpoint to update one Training into mongoDB Database
   * @param id
   * @param training
   */
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  public async updateTraining(
    @Param('id') id: string,
    @Body() training: any
  ) {

    return this.trainingsService.updateOneTraining(id, training);

  }


  /**
   * Update only labels array in the record
   * @param id
   * @param labels
   */
  @UseGuards(AccessTokenGuard)
  @Patch('labels/:id')
  public async updateTrainingLabels(
    @Param('id') id: string,
    @Body() labels: Label[]
  ) {
    return this.trainingsService.updateTrainingLabels(id, labels);
  }


  /**
   * Endpoint to delete one Training from mongoDB Database
   * @param id
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async deleteTraining(
    @Param('id') id: string
  ) {

    return this.trainingsService.deleteTraining(id);

  }


  /**
   * Endpoint to dynamically query mongoDB Database
   * @param query
   * @param userData
   */
  @UseGuards(AccessTokenGuard)
  @Get()
  public async getTrainings(
    @Query() query: string,
    @UserData() userData: IUserData
  ) {
    return this.trainingsService.get(userData.teams, parser.parse(query));
  }


}
