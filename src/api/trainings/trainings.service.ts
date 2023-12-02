import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';
import { Label } from '../../database/models/Label/Label';

import LabelTypeModel from '../../database/models/LabelType/LabelType';
import TrainingModel from '../../database/models/Training/Training';
import { NotificationsService } from '../notifications/notifications.service';


export class TrainingsService {

  constructor(
    @Inject(TrainingModel.collection.name)
    private readonly trainingModel: typeof TrainingModel,
    @Inject(LabelTypeModel.collection.name)
    private readonly labelTypeModel: typeof LabelTypeModel,
    @Inject(NotificationsService)
    private notificationService: NotificationsService
  ) {

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


  /**
   * Update a training into Database
   * @param id
   * @param training
   */
  public async updateOneTraining(id: string, training: any) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.trainingModel.findById(id).exec().then(async (exist: any) => {

      /* If none records found, exit */
      if (exist !== null) {
        await this.trainingModel.replaceOne({ _id: id }, training);
      }
      else {
        return;
      }
    }).catch(() => {
      throw new BadRequestException(
        'Could not update or create record',
        'invalid fields'
      );
    });

    /* Return a JSON with ID and message */
    return {
      id     : id,
      message: 'Record has been successfully updated'
    };

  }


  /**
   * Function to update only labels array in the training
   * @param id
   * @param labels
   */
  public async updateTrainingLabels(id: string, labels: Label[]) {
    return this.trainingModel.findByIdAndUpdate(id, {
      labels: labels
    });
  }


  /**
   * Delete one training into Database
   * @param id
   */
  public async deleteTraining(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    await this.trainingModel.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }


  /**
   * Get trainings from Database
   * @param teams
   * @param queryOptions
   */
  public async getTrainings(teams: string[], queryOptions?: QueryOptions) {

    /** Extract Query Options */
    const {
      filter,
      sort,
      limit,
      skip
    } = queryOptions || {};

    const teamsQueryString = teams.map((team: string) => {
      return { teams: team };
    });

    /** Build the query */
    let query = this.trainingModel.find({ '$or': teamsQueryString, ...filter });

    /** Append extra options */
    if (sort) {
      query = query.sort(sort);
    }

    if (limit) {
      query = query.limit(limit);
    }

    if (skip) {
      query = query.skip(skip);
    }

    /** Execute the Query */
    const [ error, docs ] = await will(query.exec());

    /** Assert no error has been found */
    if (error) {
      throw new InternalServerErrorException(error, 'trainings/query-error');
    }

    return docs;

  }

}
