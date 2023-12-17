import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';
import { Label } from '../../database/models/Label/Label';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import MatchModel from '../../database/models/Match/Match';

import PlayerModel, { Player } from '../../database/models/Player/Player';
import PlayerStatModel, { PlayerStat } from '../../database/models/PlayerStat/PlayerStat';
import { AbstractedCrudService } from '../abstractions/abstracted-crud.service';


@Injectable()
export class PlayersService extends AbstractedCrudService<Player> {

  constructor(
    @Inject(PlayerModel.collection.name)
    private readonly playerModel: typeof PlayerModel,
    @Inject(LabelTypeModel.collection.name)
    private readonly labelTypeModel: typeof LabelTypeModel,
    @Inject(PlayerStatModel.collection.name)
    private readonly playerStatModel: typeof PlayerStatModel,
    @Inject(MatchModel.collection.name)
    private readonly matchModel: typeof MatchModel
  ) {
    super(playerModel);
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
   * Updates the total statistics of a player based on their match performances.
   *
   * @param {string} id - The ID of the player.
   *
   * @throws {NotFoundException} If no matches are found for the player ID.
   *
   * @return {Promise<any>} A Promise that resolves with an object containing the updated total statistics:
   *  - totalGoals: The total number of goals scored by the player.
   *  - totalMinutes: The total number of minutes played by the player.
   *  - totalAssist: The total number of assists made by the player.
   */
  public async updatePlayerTotalStats(id: string): Promise<any> {

    /** Find all the matches with this player */
    const matches: any = await this.matchModel.find({ 'players._id': id });

    /** If no match has been found return error */
    if (!matches) {
      console.error(`No match has been found for this playerId: ${id}`);
    }

    /** Initialize global stats */
    let totalGoals = 0;
    let totalMinutes = 0;
    let totalAssist = 0;

    /** Iteration for all matches and calculate stats */
    matches.forEach((match: any) => {
      match.players.forEach((player: any) => {
        if (player._id === id) {
          totalGoals += player.goals;
          totalMinutes += player.minutes;
          totalAssist += player.assist;
        }
      });
    });

    /** Update player record */
    this.playerModel.findByIdAndUpdate(id, {
      totalGoals  : totalGoals,
      totalMinutes: totalMinutes,
      totalAssist : totalAssist
    }).exec().catch(err => {
      console.error('Player not found', err);
    });

    /** Return */
    return { totalGoals, totalMinutes, totalAssist };

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

}
