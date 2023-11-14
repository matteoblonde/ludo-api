import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';
import ExerciseTypeModel, { ExerciseType } from '../../database/models/ExerciseType/ExerciseType';


export class ExerciseTypesService {

  constructor(
    @Inject(ExerciseTypeModel.collection.name)
    private readonly exerciseTypeModel: typeof ExerciseTypeModel
  ) {

  }


  /**
   * Insert new exercise type into database
   * @param exerciseType
   */
  public async insertNewExerciseType(exerciseType: ExerciseType) {

    /* build the record */
    const record = new this.exerciseTypeModel(exerciseType);

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

  }


  /**
   * Update a exercise type into Database
   * @param id
   * @param exerciseType
   */
  public async updateOneExerciseType(id: string, exerciseType: ExerciseType) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.exerciseTypeModel.findById(id).exec().then(async (exist: any) => {
      
      /* If none records found, exit */
      if (exist !== null) {
        await this.exerciseTypeModel.replaceOne({ _id: id }, exerciseType);
      }
      else {
        throw new InternalServerErrorException('Query', 'exercise-type/query-error');
      }
    }).catch(() => {
      throw new BadRequestException(
        'Could not update or create record',
        'invalid fields'
      );
    });

    /* Return the record */
    return exerciseType;

  }


  /**
   * Delete one exercise type into Database
   * @param id
   */
  public async deleteExerciseType(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    await this.exerciseTypeModel.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }


  /**
   * Get exercise types from Database
   * @param queryOptions
   */
  public async getExerciseTypes(queryOptions?: QueryOptions) {

    /** Extract Query Options */
    const {
      filter,
      sort,
      limit,
      skip
    } = queryOptions || {};

    /** Build the query */
    let query = this.exerciseTypeModel.find(filter);

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
      throw new InternalServerErrorException(error, 'exercise-types/query-error');
    }

    return docs;

  }

}
