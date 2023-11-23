import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';
import RoleModel, { Role } from '../../database/models/Role/Role';


export class RolesService {

  constructor(
    @Inject(RoleModel.collection.name)
    private readonly roleModel: typeof RoleModel
  ) {

  }


  /**
   * Insert new role into database
   * @param role
   */
  public async insertNewRole(role: Role) {

    /** Build the final record */
    const record = new this.roleModel(role);

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

  }


  /**
   * Update a role into Database
   * @param id
   * @param role
   */
  public async updateOneRole(id: string, role: Role) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.roleModel.findById(id).exec().then(async (exist: any) => {

      /* If none records found, exit */
      if (exist !== null) {
        await this.roleModel.replaceOne({ _id: id }, role);
      }
      else {
        throw new InternalServerErrorException('Query', 'roles/query-error');
      }
    }).catch(() => {
      throw new BadRequestException(
        'Could not update or create record',
        'invalid fields'
      );
    });

    /* Return the record */
    return role;

  }


  /**
   * Delete one role into Database
   * @param id
   */
  public async deleteRole(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    await this.roleModel.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }


  /**
   * Get roles from Database
   * @param queryOptions
   */
  public async getRoles(queryOptions?: QueryOptions) {

    /** Extract Query Options */
    const {
      filter,
      sort,
      limit,
      skip
    } = queryOptions || {};

    /** Build the query */
    let query = this.roleModel.find(filter);

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
      throw new InternalServerErrorException(error, 'roles/query-error');
    }

    return docs;

  }

}
