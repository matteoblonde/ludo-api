import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';
import PlayerRoleModel, { PlayerRole } from '../../database/models/PlayerRole/PlayerRole';


export class PlayerRolesService {

  constructor(
    @Inject(PlayerRoleModel.collection.name)
    private readonly playerRoleModel: typeof PlayerRoleModel
  ) {

  }


  /**
   * Insert new player role into database
   * @param playerRole
   */
  public async insertNewPlayerRole(playerRole: PlayerRole) {

    /* build the record */
    const record = new this.playerRoleModel(playerRole);

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

  }


  /**
   * Update a player role into Database
   * @param id
   * @param playerRole
   */
  public async updateOnePlayerRole(id: string, playerRole: PlayerRole) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.playerRoleModel.findById(id).exec().then(async (exist: any) => {

      /* If none records found, exit */
      if (exist !== null) {
        await this.playerRoleModel.replaceOne({ _id: id }, playerRole);
      }
      else {
        throw new InternalServerErrorException('Query', 'player-roles/query-error');
      }
    }).catch(() => {
      throw new BadRequestException(
        'Could not update or create record',
        'invalid fields'
      );
    });

    /* Return the record */
    return playerRole;

  }


  /**
   * Delete one player role into Database
   * @param id
   */
  public async deletePlayerRole(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    await this.playerRoleModel.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }


  /**
   * Get player roles from Database
   * @param queryOptions
   */
  public async getPlayerRole(queryOptions?: QueryOptions) {

    /** Extract Query Options */
    const {
      filter,
      sort,
      limit,
      skip
    } = queryOptions || {};

    /** Build the query */
    let query = this.playerRoleModel.find(filter);

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
      throw new InternalServerErrorException(error, 'player-roles/query-error');
    }

    return docs;

  }

}
