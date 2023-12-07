import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query, UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { S3Service } from '../../aws';
import { Exercise } from '../../database/models/Exercise/Exercise';
import { Label } from '../../database/models/Label/Label';
import user from '../../database/models/User/User';
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
    private exercisesService: ExercisesService,
    private s3Service: S3Service
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
   * Update only labels array in the record
   * @param id
   * @param labels
   */
  @UseGuards(AccessTokenGuard)
  @Patch('labels/:id')
  public async updateMatchLabels(
    @Param('id') id: string,
    @Body() labels: Label[]
  ) {
    return this.exercisesService.updateExerciseLabels(id, labels);
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
   * Uploads a file.
   *
   * @param {any} file - The uploaded file.
   * @param {IUserData} userData - The user data.
   * @param {string} id - The ID of the exercise.
   * @returns {Promise<string>} A promise that resolves with the URL of the uploaded file.
   */
  @Post('upload/:id')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @UserData() userData: IUserData,
    @Param('id') id: string
  ): Promise<string> {
    const result = await this.s3Service.uploadFile(file, userData.company);

    const imgUrl = result.Location;

    /** Update exercise with the url */
    return this.exercisesService.updateExerciseImgUrl(id, imgUrl);

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
