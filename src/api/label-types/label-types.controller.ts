import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { LabelType } from '../../database/models/LabelType/LabelType';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { AccessTokenGuard } from '../auth/guards';
import { LabelTypesService } from './label-types.service';


const parser = new MongooseQueryParser();

@ApiTags('LabelType')
@Controller('label-types')
@UseInterceptors(HttpCacheInterceptor)
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
  public async insertNewLabelType(
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
  public async updateLabelType(
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
  public async deleteLabelType(
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
  public async getLabelTypes(
    @Query() query: string
  ) {
    return this.labelTypesService.get([], parser.parse(query));
  }


}
