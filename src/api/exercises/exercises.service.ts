import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';
import ExerciseModel, { Exercise } from '../../database/models/Exercise/Exercise';
import LabelTypeModel from '../../database/models/LabelType/LabelType';


export class ExercisesService {

  constructor(
    @Inject(ExerciseModel.collection.name)
    private readonly exerciseModel: typeof ExerciseModel,
    @Inject(LabelTypeModel.collection.name)
    private readonly labelTypeModel: typeof LabelTypeModel
  ) {

  }


  /**
   * Insert new exercise into database
   * @param exercise
   */
  public async insertNewExercise(exercise: Exercise) {

    /**
     * Find all labels to append to the record
     */
    const labelTypes = await this.labelTypeModel.find({ 'sections': 'exercises' });
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
    const record = new this.exerciseModel({ labels: labels, ...exercise });

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

  }


  /**
   * Update an exercise into Database
   * @param id
   * @param exercise
   */
  public async updateOneExercise(id: string, exercise: any) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.exerciseModel.findById(id).exec().then(async (exist: any) => {

      /* If none records found, exit */
      if (exist !== null) {
        await this.exerciseModel.replaceOne({ _id: id }, exercise);
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
   * Delete one exercise into Database
   * @param id
   */
  public async deleteExercise(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    await this.exerciseModel.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }


  /**
   * Get exercises from Database
   * @param teams
   * @param queryOptions
   */
  public async getExercises(teams: string[], queryOptions?: QueryOptions) {

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
    let query = this.exerciseModel.find({ '$or': teamsQueryString, ...filter });

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

    /*if (select) {
      query = query.select(select);
    }*/

    /** Execute the Query */
    const [ error, docs ] = await will(query.exec());

    /** Assert no error has been found */
    if (error) {
      throw new InternalServerErrorException(error, 'data-accessor/query-error');
    }

    return docs;

  }

}
