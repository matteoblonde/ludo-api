import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { Model } from 'mongoose';
import { QueryOptions } from 'mongoose-query-parser';
import { ICrudService } from './interfaces/CrudService';


@Injectable()
export abstract class AbstractedCrudService<T> implements ICrudService<T> {

  protected constructor(protected readonly model: Model<T>) {
  }


  async create(item: T): Promise<T> {
    const record = new this.model(item);

    await record.save();

    return record;
  }


  async delete(id: string): Promise<void | null> {
    return this.model.findByIdAndDelete(id);
  }


  async getByID(id: string): Promise<T | null> {
    return this.model.findById(id);
  }


  // TODO: Use the roleLevel to determine if filtering for teamID or not
  /**
   * Retrieves documents from the database based on the specified query options.
   *
   * @param {string[]} teams - An array of team names to filter the documents.
   * @param queryOptions
   *
   * @returns {Promise<T[]>} The retrieved documents.
   */
  async get(teams?: string[], queryOptions?: QueryOptions): Promise<T[]> {

    /** Extract Query Options */
    const {
      filter,
      sort,
      limit,
      skip
    } = queryOptions || {};

    const teamsQueryString = teams?.map((team: string) => {
      return { teams: team };
    });

    /** Build the query */
    let query = this.model.find(teams?.length === 0 || !teams ? filter : { '$or': teamsQueryString, ...filter });

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
      throw new InternalServerErrorException(error, `${this.model.collection.name}/query-error`);
    }

    return docs;
  }

}
