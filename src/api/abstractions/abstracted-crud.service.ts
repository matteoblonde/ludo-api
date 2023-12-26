import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { Model } from 'mongoose';
import { QueryOptions } from 'mongoose-query-parser';
import { ICrudService } from './interfaces/CrudService';


@Injectable()
export abstract class AbstractedCrudService<T> implements ICrudService<T> {

  protected constructor(protected readonly model: Model<T>) {
  }


  /**
   * Creates a new item in the database.
   *
   * @param item - The item to be created.
   * @returns {Promise} - Returns a promise that resolves to the created item.
   */
  async insertNewRecord(item: T): Promise<T> {
    const record = new this.model(item);

    await record.save();

    return record;
  }


  async deleteDocumentById(id: string): Promise<{ recordID: string; message: string }> {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    await this.model.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };
  }


  /**
   * Replaces a document in the database with the provided document by its ID.
   * @param {string} documentId - The ID of the document to replace.
   * @param {any} document - The new document to replace the existing one with.
   * @returns {Promise<Object>} - A JSON object containing the ID and a success message.
   * @throws {BadRequestException} - If the update or create operation fails due to invalid fields.
   */
  async replaceDocumentById(documentId: string, document: any): Promise<{
    id: string;
    message: 'Record has been successfully updated'
  } | null> {
    /* Check if id has been passed */
    if (!documentId) {
      return null;
    }

    /** Find the document by Id */
    await this.model.findById(documentId).exec().then(async (exist: any) => {

      /** If none records found, exit */
      if (exist !== null) {
        await this.model.replaceOne({ _id: documentId }, document);
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
      id     : documentId,
      message: 'Record has been successfully updated'
    };
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
   * @returns {Promise<[]>} The retrieved documents.
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
