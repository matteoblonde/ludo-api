import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';

import { TrainingAbsence } from '../../database/models/TrainingAbsence/TrainingAbsence';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { AccessTokenGuard } from '../auth/guards';
import { TrainingAbsencesService } from './training-absences.service';


const parser = new MongooseQueryParser();

@ApiTags('TrainingAbsence')
@Controller('training-absences')
@UseInterceptors(HttpCacheInterceptor)
export class TrainingAbsencesController {

  constructor(
    private trainingAbsencesService: TrainingAbsencesService
  ) {
  }


  /**
   * Endpoint to insert a record in mongoDB Database
   * @param trainingAbsence
   */
  @UseGuards(AccessTokenGuard)
  @Post()
  public async insertNewTrainingAbsence(
    @Body() trainingAbsence: TrainingAbsence
  ) {
    return this.trainingAbsencesService.insertNewTrainingAbsence(trainingAbsence);
  }


  /**
   * Endpoint to update one trainingAbsence into mongoDB Database
   * @param id
   * @param trainingAbsence
   */
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  public async updateTrainingAbsence(
    @Param('id') id: string,
    @Body() trainingAbsence: TrainingAbsence
  ) {

    return this.trainingAbsencesService.updateOneTrainingAbsence(id, trainingAbsence);

  }


  /**
   * Endpoint to delete one trainingAbsence from mongoDB Database
   * @param id
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async deletePlayerRole(
    @Param('id') id: string
  ) {

    return this.trainingAbsencesService.deleteTrainingAbsence(id);

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
    return this.trainingAbsencesService.getTrainingAbsences(parser.parse(query));
  }


}
