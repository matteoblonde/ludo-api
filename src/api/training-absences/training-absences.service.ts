import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';
import TrainingAbsenceModel, { TrainingAbsence } from '../../database/models/TrainingAbsence/TrainingAbsence';


export class TrainingAbsencesService {

  constructor(
    @Inject(TrainingAbsenceModel.collection.name)
    private readonly trainingAbsencesModel: typeof TrainingAbsenceModel
  ) {

  }


  /**
   * Insert new trainingAbsence into database
   * @param trainingAbsence
   */
  public async insertNewTrainingAbsence(trainingAbsence: TrainingAbsence) {

    /* build the record */
    const record = new this.trainingAbsencesModel(trainingAbsence);

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

  }


  /**
   * Update a trainingAbsence into Database
   * @param id
   * @param trainingAbsence
   */
  public async updateOneTrainingAbsence(id: string, trainingAbsence: TrainingAbsence) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.trainingAbsencesModel.findById(id).exec().then(async (exist: any) => {

      /* If none records found, exit */
      if (exist !== null) {
        await this.trainingAbsencesModel.replaceOne({ _id: id }, trainingAbsence);
      }
      else {
        throw new InternalServerErrorException('Query', 'training-absences/query-error');
      }
    }).catch(() => {
      throw new BadRequestException(
        'Could not update or create record',
        'invalid fields'
      );
    });

    /* Return the record */
    return trainingAbsence;

  }


  /**
   * Delete one player role into Database
   * @param id
   */
  public async deleteTrainingAbsence(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    await this.trainingAbsencesModel.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }


  /**
   * Get trainingAbsence from Database
   * @param queryOptions
   */
  public async getTrainingAbsences(queryOptions?: QueryOptions) {

    /** Extract Query Options */
    const {
      filter,
      sort,
      limit,
      skip
    } = queryOptions || {};

    /** Build the query */
    let query = this.trainingAbsencesModel.find(filter);

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
      throw new InternalServerErrorException(error, 'training-absences/query-error');
    }

    return docs;

  }

}
