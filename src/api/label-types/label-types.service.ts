import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';
import LabelTypeModel, { LabelType } from '../../database/models/LabelType/LabelType';


export class LabelTypesService {

  constructor(
    @Inject(LabelTypeModel.collection.name)
    private readonly labelTypeModel: typeof LabelTypeModel
  ) {

  }


  /**
   * Insert new label type into database
   * @param labelType
   */
  public async insertNewLabelType(labelType: LabelType) {

    /* build the record */
    const record = new this.labelTypeModel(labelType);

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

  }


  /**
   * Update a label type into Database
   * @param id
   * @param labelType
   */
  public async updateOneLabelType(id: string, labelType: LabelType) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.labelTypeModel.findById(id).exec().then(async (exist: any) => {

      console.log(exist);
      /* If none records found, exit */
      if (exist !== null) {
        await this.labelTypeModel.replaceOne({ _id: id }, labelType);
      }
      else {
        throw new InternalServerErrorException('Query', 'player/query-error');
      }
    }).catch(() => {
      throw new BadRequestException(
        'Could not update or create record',
        'invalid fields'
      );
    });

    /* Return the record */
    return labelType;

  }


  /**
   * Delete one label type into Database
   * @param id
   */
  public async deleteLabelType(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    await this.labelTypeModel.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }


  /**
   * Get label types from Database
   * @param queryOptions
   */
  public async getLabelTypes(queryOptions?: QueryOptions) {

    /** Extract Query Options */
    const {
      filter,
      sort,
      limit,
      skip
    } = queryOptions || {};

    /** Build the query */
    let query = this.labelTypeModel.find(filter);

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
      throw new InternalServerErrorException(error, 'label-types/query-error');
    }

    return docs;

  }

}
