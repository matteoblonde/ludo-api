import { Inject, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ROUTE_MODEL } from '../../database/database.providers';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import { AbstractedCrudService } from '../abstractions/abstracted-crud.service';


@Injectable()
export class CrudService extends AbstractedCrudService<any> {

  constructor(
    @Inject(ROUTE_MODEL)
    private readonly routeModel: mongoose.Model<any>,
    @Inject(LabelTypeModel.collection.name)
    private readonly labelTypeModel: typeof LabelTypeModel
  ) {
    super(routeModel);
  }


  /**
   * Inserts a new record into the database.
   *
   * @param {Object} record - The record to be inserted.
   * @return {Promise<Object>} - The created record.
   */
  public async insertNewRecordWithLabels(record: any): Promise<object> {

    /** Build labelTypes sections query string */
    let sectionsQuery: any = { sections: this.routeModel.collection.name };
    if (this.routeModel.collection.name === 'matches') {
      sectionsQuery = { $or: [ { sections: 'matches' }, { sections: 'match-report' } ] };
    }

    /** If creation of labels is needed */
    const labelTypes = await this.labelTypeModel.find(sectionsQuery).exec();
    let labels;

    if (labelTypes) {
      labels = labelTypes.map((labelType) => {
        return {
          labelName          : labelType.labelTypeName,
          labelPossibleValues: labelType.isValueList ? labelType.labelTypeValuesList : null,
          isFreeText         : labelType.isFreeText,
          isValueList        : labelType.isValueList,
          labelValue         : '',
          labelValueType     : labelType.labelValueType
        };
      });
    }

    /** Build the final record */
    const finalRecord = new this.routeModel({ labels: labels, ...record });

    /* save the record, mongo.insertOne() */
    await finalRecord.save();

    /* return created record */
    return finalRecord;

  }


  /**
   * Updates a field in a document.
   *
   * @param {string} documentId - The ID of the document.
   * @param {string} field - The name of the field to update.
   * @param {*} value - The new value of the field.
   * @returns {Promise} - A promise that resolves to the updated document.
   */
  public async updateFieldInDocument(documentId: string, field: string, value: any): Promise<any> {

    return this.routeModel.findByIdAndUpdate(documentId, { $set: { [field]: value.value } }).exec();

  }

}
