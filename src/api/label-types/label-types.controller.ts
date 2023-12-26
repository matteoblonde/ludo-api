import {
  Body,
  Controller,
  Param,
  Patch,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Label } from '../../database/models/Label/Label';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { AccessTokenGuard } from '../auth/guards';
import { LabelTypesService } from './label-types.service';


@ApiTags('LabelType')
@Controller(':collection')
@UseInterceptors(HttpCacheInterceptor)
export class LabelTypesController {

  constructor(
    private labelTypesService: LabelTypesService
  ) {
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
    return this.labelTypesService.updateLabelsInDocument(id, labels);
  }


}
