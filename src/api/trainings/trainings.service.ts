import { Inject } from '@nestjs/common';
import mongoose from 'mongoose';
import { ROUTE_MODEL } from '../../database/database.providers';

import LabelTypeModel from '../../database/models/LabelType/LabelType';
import { Training } from '../../database/models/Training/Training';
import { AbstractedCrudService } from '../abstractions/abstracted-crud.service';
import { NotificationsService } from '../notifications/notifications.service';


export class TrainingsService extends AbstractedCrudService<Training> {

  constructor(
    @Inject(ROUTE_MODEL)
    private readonly trainingModel: mongoose.Model<any>,
    @Inject(LabelTypeModel.collection.name)
    private readonly labelTypeModel: typeof LabelTypeModel,
    @Inject(NotificationsService)
    private notificationService: NotificationsService
  ) {
    super(trainingModel);
  }


  /**
   * Insert new training into database
   * @param training
   */
  public async insertNewTraining(training: any) {

    /**
     * Find all labels to append to the record
     */
    const labelTypes = await this.labelTypeModel.find({ 'sections': 'trainings' });
    const labels = labelTypes.map((labelType) => {
      return {
        labelName          : labelType.labelTypeName,
        labelPossibleValues: labelType.isValueList ? labelType.labelTypeValuesList : null,
        isFreeText         : labelType.isFreeText,
        isValueList        : labelType.isValueList,
        labelValue         : '',
        labelValueType     : labelType.labelValueType
      };
    });

    /**
     * Build the final record
     */
    const record = new this.trainingModel({ labels: labels, ...training });

    /* save the record, mongo.insertOne() */
    await record.save();

    /** Create notification for this record */
    await this.notificationService.insertNewNotification({
      teams      : record.teams,
      userId     : record.userId,
      title      : 'New Training Created',
      description: record.trainingTitle,
      routerLink : `trainings/${record._id}/general/${record._id}`
    });

    /* return created record */
    return record;

  }

}
