import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { TrainingType } from '../../database/models/TrainingType/TrainingType';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { AccessTokenGuard } from '../auth/guards';
import { TrainingTypesService } from './training-types.service';


const parser = new MongooseQueryParser();

@ApiTags('TrainingTypes')
@Controller('training-types')
@UseInterceptors(HttpCacheInterceptor)
export class TrainingTypesController {

  constructor(
    private trainingTypesService: TrainingTypesService
  ) {
  }


  /**
   * Endpoint to insert a record in mongoDB Database
   * @param trainingType
   */
  @UseGuards(AccessTokenGuard)
  @Post()
  public async insertNewTrainingTypes(
    @Body() trainingType: TrainingType
  ) {
    return this.trainingTypesService.insertNewTrainingType(trainingType);
  }


  /**
   * Endpoint to update one training type into mongoDB Database
   * @param id
   * @param trainingType
   */
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  public async updateTrainingType(
    @Param('id') id: string,
    @Body() trainingType: TrainingType
  ) {

    return this.trainingTypesService.updateOneTrainingType(id, trainingType);

  }


  /**
   * Endpoint to delete one training type from mongoDB Database
   * @param id
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async deleteTrainingType(
    @Param('id') id: string
  ) {

    return this.trainingTypesService.deleteTrainingType(id);

  }


  /**
   * Endpoint to dynamically query mongoDB Database
   * @param query
   */
  @UseGuards(AccessTokenGuard)
  @Get()
  public async getTrainingTypes(
    @Query() query: string
  ) {
    return this.trainingTypesService.get([], parser.parse(query));
  }


}
