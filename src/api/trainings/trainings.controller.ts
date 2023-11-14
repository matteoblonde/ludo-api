import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { AccessTokenGuard } from '../auth/guards';
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
   */
  @UseGuards(AccessTokenGuard)
  @Post()
  public async insertNewTraining(
    @Body() training: any
  ) {
    return this.trainingsService.insertNewTraining(training);
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
   */
  @UseGuards(AccessTokenGuard)
  @Get()
  public async getTrainings(
    @Query() query: string
  ) {
    return this.trainingsService.getTrainings(parser.parse(query));
  }


}
