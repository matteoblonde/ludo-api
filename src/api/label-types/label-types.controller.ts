import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import labelType, { LabelType } from '../../database/models/LabelType/LabelType';
import { Player } from '../../database/models/Player/Player';
import { AccessTokenGuard } from '../auth/guards';
import { LabelTypesService } from './label-types.service';


const parser = new MongooseQueryParser();

@ApiTags('LabelType')
@Controller('label-types')
export class LabelTypesController {

  constructor(
    private labelTypesService: LabelTypesService
  ) {
  }


  /**
   * Endpoint to insert a record in mongoDB Database
   * @param labelType
   */
  @UseGuards(AccessTokenGuard)
  @Post()
  public async insertNewExercise(
    @Body() labelType: LabelType
  ) {
    return this.labelTypesService.insertNewLabelType(labelType);
  }


  /**
   * Endpoint to update one label type into mongoDB Database
   * @param id
   * @param labelType
   */
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  public async updateExercise(
    @Param('id') id: string,
    @Body() labelType: LabelType
  ) {

    return this.labelTypesService.updateOneLabelType(id, labelType);

  }


  /**
   * Endpoint to delete one label type from mongoDB Database
   * @param id
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async deleteExercise(
    @Param('id') id: string
  ) {

    return this.labelTypesService.deleteLabelType(id);

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
    return this.labelTypesService.getLabelTypes(parser.parse(query));
  }


}
