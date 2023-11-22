import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { Training } from '../../database/models/Training/Training';
import { UserData } from '../auth/decorators';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { TrainingsService } from './trainings.service';


const parser = new MongooseQueryParser();

@ApiTags('Trainings')
@Controller('trainings')
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
    return this.trainingsService.getTrainings(userData.teams, parser.parse(query));
  }


}
