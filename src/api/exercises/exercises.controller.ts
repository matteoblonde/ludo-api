import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { Exercise } from '../../database/models/Exercise/Exercise';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { ExercisesService } from './exercises.service';

import { UserData } from '../auth/decorators';


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
   * @param userData
   */
  @UseGuards(AccessTokenGuard)
  @Post()
  public async insertNewExercise(
    @Body() exercise: Exercise,
    @UserData() userData: IUserData
  ) {
    return this.exercisesService.insertNewExercise({ userId: userData.userId, ...exercise });
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


  // TODO: Use the two decorators (UserData, existing, Role, to create)
  // TODO: to get right data dependent from user role
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
