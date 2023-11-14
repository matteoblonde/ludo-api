import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';
import PlayerRoleModel, { PlayerRole } from '../../database/models/PlayerRole/PlayerRole';
import PlayerStatModel, { PlayerStat } from '../../database/models/PlayerStat/PlayerStat';


export class PlayerStatsService {

  constructor(
    @Inject(PlayerStatModel.collection.name)
    private readonly playerStatModel: typeof PlayerStatModel
  ) {

  }


  /**
   * Insert new player stat into database
   * @param playerStat
   */
  public async insertNewPlayerStat(playerStat: PlayerStat) {

    /* build the record */
    const record = new this.playerStatModel(playerStat);

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

  }


  /**
   * Update a player stat into Database
   * @param id
   * @param playerStat
   */
  public async updateOnePlayerStat(id: string, playerStat: PlayerStat) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.playerStatModel.findById(id).exec().then(async (exist: any) => {

      /* If none records found, exit */
      if (exist !== null) {
        await this.playerStatModel.replaceOne({ _id: id }, playerStat);
      }
      else {
        throw new InternalServerErrorException('Query', 'player-stat/query-error');
      }
    }).catch(() => {
      throw new BadRequestException(
        'Could not update or create record',
        'invalid fields'
      );
    });

    /* Return the record */
    return playerStat;

  }


  /**
   * Delete one player stat into Database
   * @param id
   */
  public async deletePlayerStat(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    await this.playerStatModel.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }


  /**
   * Get player stat from Database
   * @param queryOptions
   */
  public async getPlayerStat(queryOptions?: QueryOptions) {

    console.log(queryOptions);

    /** Extract Query Options */
    const {
      filter,
      sort,
      limit,
      skip
    } = queryOptions || {};

    /** Build the query */
    let query = this.playerStatModel.find(filter);

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
      throw new InternalServerErrorException(error, 'player-stats/query-error');
    }

    return docs;

  }

}
