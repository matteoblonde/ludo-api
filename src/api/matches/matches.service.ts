import { BadRequestException, Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { will } from '@proedis/utils';
import * as console from 'console';
import { QueryOptions } from 'mongoose-query-parser';
import { Label } from '../../database/models/Label/Label';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import MatchModel, { Match } from '../../database/models/Match/Match';
import player, { Player } from '../../database/models/Player/Player';
import { PlayersService } from '../players/players.service';


export class MatchesService {

  constructor(
    @Inject(MatchModel.collection.name)
    private readonly matchModel: typeof MatchModel,
    @Inject(LabelTypeModel.collection.name)
    private readonly labelTypeModel: typeof LabelTypeModel,
    @Inject(PlayersService)
    private playersService: PlayersService
  ) {

  }


  /**
   * Insert new match into database
   * @param match
   */
  public async insertNewMatch(match: Match) {

    /** Find all labels to append to the record */
    const labelTypes = await this.labelTypeModel.find({ 'sections': 'matches' });
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

    /** Build the final record */
    const record = new this.matchModel({ labels: labels, ...match });

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

  }


  /**
   * Update a match into Database
   * @param id
   * @param match
   */
  public async updateOneMatch(id: string, match: Match) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.matchModel.findById(id).exec().then(async (exist: any) => {

      /* If none records found, exit */
      if (exist !== null) {
        await this.matchModel.replaceOne({ _id: id }, match);
      }
      else {
        throw new InternalServerErrorException('Query', 'matches/query-error');
      }
    }).catch(() => {
      throw new BadRequestException(
        'Could not update or create record',
        'invalid fields'
      );
    });

    /* Return the record */
    return match;

  }


  /**
   * Updates the players in a match.
   *
   * @param {string} id - The ID of the match.
   * @param {Player[]} players - An array of Player objects representing the new players of the match.
   * @return {Promise<any>} - A Promise that resolves with the updated match object if successful.
   */
  public async updateMatchPlayers(id: string, players: Player[]): Promise<any> {

    return this.matchModel.findByIdAndUpdate(id, {
      players: players
    });
  }


  /**
   * Updates the match report for a single player.
   *
   * @param {string} matchId - The ID of the match.
   * @param {string} playerId - The ID of the player.
   * @param {Object} player - The updated data for the player.
   * @throws {NotFoundException} If the player with the given ID is not found in the match.
   * @returns {Object} A message indicating that the match report has been updated successfully.
   */
  public async updateMatchSinglePlayer(matchId: string, playerId: string, player: any): Promise<object> {

    /** Find the match */
    const match: any = await this.matchModel.findById(matchId);
    const playerIndex = match.players.findIndex((p: any) => p._id === playerId);

    /** If no player has been found return error */
    if (playerIndex === -1) {
      throw new NotFoundException(`Player with ID: ${playerId} not found in the match`);
    }

    /** Update data of the player */
    Object.assign(match.players[playerIndex], player);
    match.markModified('players');

    /** Save the match */
    await match.save();

    /** Update total stats of the player asynchronous */
    this.playersService.updatePlayerTotalStats(playerId).catch(err => {
      console.error('Error during total stats update', err);
    });

    /** Return */
    return { message: 'Match report updated successfully' };

  }


  /**
   * Function to update only labels array in the match
   * @param id
   * @param labels
   */
  public async updateMatchLabels(id: string, labels: Label[]) {
    return this.matchModel.findByIdAndUpdate(id, {
      labels: labels
    });
  }


  /**
   * Delete one match into Database
   * @param id
   */
  public async deleteMatch(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    const match: any = await this.matchModel.findById(id);
    await this.matchModel.findByIdAndDelete(id);

    /** For each player in the match run the update of statistics */
    match?.players.forEach((player: any) => {
      this.playersService.updatePlayerTotalStats(player._id).catch(err => {
        console.error('Error during total stats update', err);
      });
    });

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }


  /**
   * Get matches from Database
   * @param teams
   * @param queryOptions
   */
  public async getMatches(teams: string[], queryOptions?: QueryOptions) {

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
    let query = this.matchModel.find({ '$or': teamsQueryString, ...filter });

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
      throw new InternalServerErrorException(error, 'matches/query-error');
    }

    return docs;

  }

}
