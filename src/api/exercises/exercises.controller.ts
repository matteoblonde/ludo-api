import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { Exercise } from '../../database/models/Exercise/Exercise';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { ExercisesService } from './exercises.service';

import { UserData } from '../auth/decorators';


const parser = new MongooseQueryParser();

// TODO: Test if caching interceptor works
@ApiTags('Exercises')
@Controller('exercises')
@UseInterceptors(HttpCacheInterceptor)
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
    return this.exercisesService.insertNewExercise({ teams: userData.teams, userId: userData.userId, ...exercise });
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


  // TODO: Use the roleLevel to determine if filtering for teamID or not
  /**
   * Endpoint to dynamically query mongoDB Database
   * @param query
   * @param userData
   */
  @UseGuards(AccessTokenGuard)
  @Get()
  public async getExercises(
    @Query() query: string,
    @UserData() userData: IUserData
  ) {
    return this.exercisesService.getExercises(userData.teams, parser.parse(query));
  }


}
