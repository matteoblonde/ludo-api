import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';
import UserModel, { User } from '../../database/models/User/User';


export class UsersService {

  constructor(
    @Inject(UserModel.collection.name)
    private readonly userModel: typeof UserModel
  ) {

  }


  /**
   * Insert new user into database
   * @param user
   */
  public async insertNewUser(user: User) {

    /**
     * Build the final record
     */
    const record = new this.userModel(user);

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

  }


  /**
   * Update a User into Database
   * @param id
   * @param user
   */
  public async updateOneUser(id: string, user: User) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.userModel.findById(id).exec().then(async (exist: any) => {

      /* If none records found, exit */
      if (exist !== null) {
        await this.userModel.replaceOne({ _id: id }, user);
      }
      else {
        throw new InternalServerErrorException('Query', 'users/query-error');
      }
    }).catch(() => {
      throw new BadRequestException(
        'Could not update or create record',
        'invalid fields'
      );
    });

    /* Return the record */
    return user;

  }


  /**
   * Delete one user into Database
   * @param id
   */
  public async deleteUser(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    await this.userModel.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }


  /**
   * Get users from Database
   * @param queryOptions
   */
  public async getUsers(queryOptions?: QueryOptions) {

    /** Extract Query Options */
    const {
      filter,
      sort,
      limit,
      skip
    } = queryOptions || {};

    /** Build the query */
    let query = this.userModel.find(filter);

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
      throw new InternalServerErrorException(error, 'users/query-error');
    }

    return docs;

  }

}
