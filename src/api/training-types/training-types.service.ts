import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';
import TrainingTypeModel, { TrainingType } from '../../database/models/TrainingType/TrainingType';


export class TrainingTypesService {

  constructor(
    @Inject(TrainingTypeModel.collection.name)
    private readonly trainingTypeModel: typeof TrainingTypeModel
  ) {

  }


  /**
   * Insert new training type into database
   * @param trainingType
   */
  public async insertNewTrainingType(trainingType: TrainingType) {

    /* build the record */
    const record = new this.trainingTypeModel(trainingType);

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

  }


  /**
   * Update a training type into Database
   * @param id
   * @param trainingType
   */
  public async updateOneTrainingType(id: string, trainingType: TrainingType) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.trainingTypeModel.findById(id).exec().then(async (exist: any) => {

      /* If none records found, exit */
      if (exist !== null) {
        await this.trainingTypeModel.replaceOne({ _id: id }, trainingType);
      }
      else {
        throw new InternalServerErrorException('Query', 'training-type/query-error');
      }
    }).catch(() => {
      throw new BadRequestException(
        'Could not update or create record',
        'invalid fields'
      );
    });

    /* Return the record */
    return trainingType;

  }


  /**
   * Delete one training type into Database
   * @param id
   */
  public async deleteTrainingType(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    await this.trainingTypeModel.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }


  /**
   * Get training types from Database
   * @param queryOptions
   */
  public async getTrainingTypes(queryOptions?: QueryOptions) {

    /** Extract Query Options */
    const {
      filter,
      sort,
      limit,
      skip
    } = queryOptions || {};

    /** Build the query */
    let query = this.trainingTypeModel.find(filter);

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
      throw new InternalServerErrorException(error, 'training-types/query-error');
    }

    return docs;

  }

}
