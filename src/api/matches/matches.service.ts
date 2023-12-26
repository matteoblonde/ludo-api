import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import * as console from 'console';
import mongoose from 'mongoose';
import { ROUTE_MODEL } from '../../database/database.providers';
import { Label } from '../../database/models/Label/Label';
import { Match } from '../../database/models/Match/Match';
import { Player } from '../../database/models/Player/Player';
import { AbstractedCrudService } from '../abstractions/abstracted-crud.service';
import { PlayersService } from '../players/players.service';


export class MatchesService extends AbstractedCrudService<Match> {

  constructor(
    @Inject(ROUTE_MODEL)
    private readonly matchModel: mongoose.Model<any>,
    @Inject(PlayersService)
    private playersService: PlayersService
  ) {
    super(matchModel);
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

}
