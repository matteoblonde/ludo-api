import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';
import { Label } from '../../database/models/Label/Label';
import LabelTypeModel from '../../database/models/LabelType/LabelType';

import PlayerModel, { Player } from '../../database/models/Player/Player';
import PlayerStatModel, { PlayerStat } from '../../database/models/PlayerStat/PlayerStat';
import team from '../../database/models/Team/Team';
import user from '../../database/models/User/User';
import { IUserData } from '../auth/interfaces/UserData';


export class PlayersService {

  constructor(
    @Inject(PlayerModel.collection.name)
    private readonly playerModel: typeof PlayerModel,
    @Inject(LabelTypeModel.collection.name)
    private readonly labelTypeModel: typeof LabelTypeModel,
    @Inject(PlayerStatModel.collection.name)
    private readonly playerStatModel: typeof PlayerStatModel
  ) {

  }


  /**
   * Insert new player into database
   * @param player
   */
  public async insertNewPlayer(player: Player) {

    /** Find all labels to append to the record */
    const labelTypes = await this.labelTypeModel.find({ 'sections': 'players' });
    const labels = labelTypes.map((labelType) => {
      return {
        labelName          : labelType.labelTypeName,
        labelPossibleValues: labelType.isValueList ? labelType.labelTypeValuesList : null,
        isFreeText         : labelType.isFreeText,
        isValueList        : labelType.isValueList,
        labelValue         : '',
        labelValueType     : labelType.labelValueType
      };
    });

    /** Find all player stats to insert by default */
    const playerStats = await this.playerStatModel.find({ 'isForAllRoles': true });

    /** Build the final record */
    const record = new this.playerModel({ labels: labels, stats: playerStats, ...player });

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

  }


  /**
   * Update a player into Database
   * @param id
   * @param player
   */
  public async updateOnePlayer(id: string, player: Player) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.playerModel.findById(id).exec().then(async (exist: any) => {

      /* If none records found, exit */
      if (exist !== null) {
        await this.playerModel.replaceOne({ _id: id }, player);
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
    return player;

  }


  /**
   * Function to update player stats
   * @param id
   * @param stats
   */
  public async updatePlayerStats(id: string, stats: PlayerStat[]) {

    return this.playerModel.findByIdAndUpdate(id, {
      stats: stats
    });

  }


  /**
   * Function to update only labels array in the player
   * @param id
   * @param labels
   */
  public async updatePlayerLabels(id: string, labels: Label[]) {
    return this.playerModel.findByIdAndUpdate(id, {
      labels: labels
    });
  }


  /**
   * Updates the total stats of a player.
   *
   * @param {string} id - The unique identifier of the player.
   * @param {Object} matchPlayerStats - The player's stats for a specific match.
   * @param {number} matchPlayerStats.goals - The number of goals scored by the player in the match.
   * @param {number} matchPlayerStats.assists - The number of assists made by the player in the match.
   * @param {number} matchPlayerStats.minutes - The number of minutes played by the player in the match.
   * @returns {Promise} - A promise that resolves to the updated player object or null if no player is found with the given id.
   */
  public async updatePlayerTotalStats(id: string, matchPlayerStats: any) {

    const { goals, assist, minutes } = matchPlayerStats;

    return this.playerModel.findByIdAndUpdate(id, {
      $inc: {
        totalGoals  : goals,
        totalAssist : assist,
        totalMinutes: minutes
      }
    });

  }


  /**
   * Delete one player into Database
   * @param id
   */
  public async deletePlayer(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    await this.playerModel.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }


  /**
   * Get exercises from Database
   * @param teams
   * @param queryOptions
   */
  public async getPlayers(teams: string[], queryOptions?: QueryOptions) {

    /** Extract Query Options */
    const {
      filter,
      sort,
      limit,
      skip
    } = queryOptions || {};

    const teamsQueryString = teams.map((team: string) => {
      return { teams: team };
    });

    /** Build the query */
    let query = this.playerModel.find({ '$or': teamsQueryString, ...filter });

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
      throw new InternalServerErrorException(error, 'player/query-error');
    }

    return docs;

  }

}
