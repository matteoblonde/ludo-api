import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { AccessTokenGuard, AdminGuard } from '../auth/guards';
import { ExercisesService } from './exercises.service';


const parser = new MongooseQueryParser();

@ApiTags('Exercises')
@Controller('exercises')
export class ExercisesController {

  constructor(
    private exercisesService: ExercisesService
  ) {
  }


  /**
   * Endpoint to insert a record in mongoDB Database
   * @param exercise
   */
  @UseGuards(AccessTokenGuard)
  @Post()
  public async insertNewExercise(
    @Body() exercise: any
  ) {
    return this.exercisesService.insertNewExercise(exercise);
  }


  /**
   * Endpoint to update one Exercise into mongoDB Database
   * @param id
   * @param exercise
   */
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  public async updateExercise(
    @Param('id') id: string,
    @Body() exercise: any
  ) {

    return this.exercisesService.updateOneExercise(id, exercise);

  }


  /**
   * Endpoint to delete one Exercise from mongoDB Database
   * @param id
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async deleteExercise(
    @Param('id') id: string
  ) {

    return this.exercisesService.deleteExercise(id);

  }


  /**
   * Endpoint to dynamically query mongoDB Database
   * @param query
   */
  @UseGuards(AccessTokenGuard)
  @Get()
  public async getExercises(
    @Query() query: string
  ) {
    return this.exercisesService.getExercises(parser.parse(query));
  }


}
