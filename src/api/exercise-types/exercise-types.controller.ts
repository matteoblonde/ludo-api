import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { ExerciseType } from '../../database/models/ExerciseType/ExerciseType';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { AccessTokenGuard } from '../auth/guards';
import { ExerciseTypesService } from './exercise-types.service';


const parser = new MongooseQueryParser();

@ApiTags('ExerciseTypes')
@Controller('exercise-types')
@UseInterceptors(HttpCacheInterceptor)
export class ExerciseTypesController {

  constructor(
    private exerciseTypesService: ExerciseTypesService
  ) {
  }


  /**
   * Endpoint to insert a record in mongoDB Database
   * @param exerciseType
   */
  @UseGuards(AccessTokenGuard)
  @Post()
  public async insertNewExerciseTypes(
    @Body() exerciseType: ExerciseType
  ) {
    return this.exerciseTypesService.insertNewExerciseType(exerciseType);
  }


  /**
   * Endpoint to update one exercise type into mongoDB Database
   * @param id
   * @param exerciseType
   */
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  public async updateExerciseType(
    @Param('id') id: string,
    @Body() exerciseType: ExerciseType
  ) {

    return this.exerciseTypesService.updateOneExerciseType(id, exerciseType);

  }


  /**
   * Endpoint to delete one exercise type from mongoDB Database
   * @param id
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async deleteExerciseType(
    @Param('id') id: string
  ) {

    return this.exerciseTypesService.deleteExerciseType(id);

  }


  /**
   * Endpoint to dynamically query mongoDB Database
   * @param query
   */
  @UseGuards(AccessTokenGuard)
  @Get()
  public async getExerciseTypes(
    @Query() query: string
  ) {
    return this.exerciseTypesService.get([], parser.parse(query));
  }


}
