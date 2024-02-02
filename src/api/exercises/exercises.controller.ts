import {
  Body,
  Controller, Delete,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { S3Service } from '../../aws';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { ExercisesService } from './exercises.service';

import { UserData } from '../auth/decorators';


@ApiTags('Exercises')
@Controller(':collection')
@UseInterceptors(HttpCacheInterceptor)
export class ExercisesController {

  constructor(
    private exercisesService: ExercisesService,
    private s3Service: S3Service
  ) {
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


  /**
   * Deletes a file from the S3 service.
   *
   * @param {string} id - The ID of the file to delete.
   * @param {IUserData} userData - The user data containing the company information.
   * @returns {Promise} A promise that resolves once the file is deleted.
   */
  @Delete('image/:id')
  @UseGuards(AccessTokenGuard)
  async deleteFile(
    @Param('id') id: string,
    @UserData() userData: IUserData
  ): Promise<any> {
    return this.exercisesService.deleteExerciseImg(id, userData.company);
  }


}
