import { Inject } from '@nestjs/common';
import mongoose from 'mongoose';
import { ROUTE_MODEL } from '../../database/database.providers';
import { Label } from '../../database/models/Label/Label';
import { LabelType } from '../../database/models/LabelType/LabelType';
import { AbstractedCrudService } from '../abstractions/abstracted-crud.service';


export class LabelTypesService extends AbstractedCrudService<LabelType> {

  constructor(
    @Inject(ROUTE_MODEL)
    private readonly labelTypeModel: mongoose.Model<any>
  ) {
    super(labelTypeModel);
  }


  /**
   * Function to update labels array in the document
   * @param id
   * @param labels
   */
  public async updateLabelsInDocument(id: string, labels: Label[]) {
    return this.labelTypeModel.findByIdAndUpdate(id, {
      labels: labels
    });
  }

}
