import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';

import TeamModel, { Team } from '../../database/models/Team/Team';
import UserModel from '../../database/models/User/User';


export class TeamsService {

  constructor(
    @Inject(TeamModel.collection.name)
    private readonly teamModel: typeof TeamModel,
    @Inject(UserModel.collection.name)
    private readonly userModel: typeof UserModel
  ) {

  }


  /**
   * Insert new team into database
   * @param team
   */
  public async insertNewTeam(team: Team) {

    /** Build the final record */
    const record = new this.teamModel(team);

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

  }


  /**
   * Update a team into Database
   * @param id
   * @param team
   */
  public async updateOneTeam(id: string, team: Team) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.teamModel.findById(id).exec().then(async (exist: any) => {

      /* If none records found, exit */
      if (exist !== null) {
        await this.teamModel.replaceOne({ _id: id }, team);
      }
      else {
        throw new InternalServerErrorException('Query', 'teams/query-error');
      }
    }).catch(() => {
      throw new BadRequestException(
        'Could not update or create record',
        'invalid fields'
      );
    });

    /* Return the record */
    return team;

  }


  /**
   * Delete one team into Database
   * @param id
   */
  public async deleteTeam(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    await this.teamModel.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }


  /**
   * Get teams from Database
   * @param queryOptions
   */
  public async getTeams(queryOptions?: QueryOptions) {

    /** Extract Query Options */
    const {
      filter,
      sort,
      limit,
      skip
    } = queryOptions || {};

    /** Build the query */
    let query = this.teamModel.find(filter);

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
      throw new InternalServerErrorException(error, 'teams/query-error');
    }

    return docs;

  }

}
