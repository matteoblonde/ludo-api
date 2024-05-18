import {
  Inject,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import mongoose, { Connection } from 'mongoose';
import { DATABASE_CONNECTION, getModel, ROUTE_MODEL } from '../../database/database.providers';
import LabelTypeModel from '../../database/models/LabelType/LabelType';

import PlayerModel, { Player } from '../../database/models/Player/Player';
import PlayerSchema from '../../database/models/Player/Player.Schema';
import PlayerAttributeModel, { PlayerAttribute } from '../../database/models/PlayerAttribute/PlayerAttribute';
import { ScoutedPlayer } from '../../database/models/ScoutedPlayer/ScoutedPlayer';
import ScoutingStatusModel from '../../database/models/ScoutingStatus/ScoutingStatus';
import { AbstractedCrudService } from '../abstractions/abstracted-crud.service';


@Injectable()
export class ScoutedPlayersService extends AbstractedCrudService<Player> {

  constructor(
    @Inject(ROUTE_MODEL)
    private readonly scoutedPlayerModel: mongoose.Model<any>,
    @Inject(LabelTypeModel.collection.name)
    private readonly labelTypeModel: typeof LabelTypeModel,
    @Inject(PlayerAttributeModel.collection.name)
    private readonly playerAttributeModel: typeof PlayerAttributeModel,
    @Inject(ScoutingStatusModel.collection.name)
    private readonly scoutingStatusModel: typeof ScoutingStatusModel,
    @Inject(DATABASE_CONNECTION)
    private connection: Connection
  ) {
    super(scoutedPlayerModel);
  }


  /**
   * Insert new scouted player into database
   * @param scoutedPlayer
   */
  public async insertNewScoutedPlayer(scoutedPlayer: ScoutedPlayer) {

    /** Find all labels to append to the record */
    const labelTypes = await this.labelTypeModel.find({ 'sections': 'scouting' });
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
    const scoutedPlayerAttributes = await this.playerAttributeModel.find({}, {}, { sort: 'order' });
    /** Map attributes and convert _id to string */
    const scoutedPlayerAttributesConverted = scoutedPlayerAttributes.map((attribute: any) => {
      return { ...attribute.toObject(), _id: attribute._id.toString() };
    });

    /** Find default scouting status */
    const defaultScoutingStatus = await this.scoutingStatusModel.find({ isDefault: true }, {}, { sort: 'order' });

    /** Build the final record */
    const record = new this.scoutedPlayerModel({
      labels        : labels,
      attributes    : scoutedPlayerAttributesConverted,
      scoutingStatus: defaultScoutingStatus ? defaultScoutingStatus[0] : null,
      ...scoutedPlayer
    });

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

  }


  /**
   * Update the attribute value for a player.
   *
   * @param {string} playerId - The ID of the player.
   * @param {string} attributeId - The ID of the attribute to update.
   * @param {PlayerAttribute} attribute - The updated attribute value.
   *
   **/
  /*public async updatePlayerAttributeValue(playerId: string, attributeId: string, attribute: PlayerAttribute) {

    const fieldToUpdate = 'attributes.$[attr]';

    /!** Update the attribute *!/
    await this.scoutedPlayerModel.findByIdAndUpdate(
      playerId,
      { $set: { [fieldToUpdate]: attribute } },
      {
        arrayFilters: [ { 'attr._id': attributeId } ],
        new         : true
      }
    ).exec();

    /!** Write the value in the attribute story *!/
    const attributeStory = new this.attributeStoryModel({
      playerId : playerId,
      attribute: attribute
    });
    await attributeStory.save().catch((error: any) => console.log(error));

  }*/


  /**
   * Updates the total statistics of a player based on their match performances.
   *
   * @param {string} id - The ID of the player.
   *
   *
   * @return {Promise<any>} A Promise that resolves with an object containing the updated total statistics:
   *  - totalGoals: The total number of goals scored by the player.
   *  - totalMinutes: The total number of minutes played by the player.
   *  - totalAssist: The total number of assists made by the player.
   */
  /*public async updatePlayerTotalStats(id: string): Promise<any> {

    /!** Build the aggregation pipeline to retrieve total stats *!/
    const aggregate = await this.matchModel.aggregate([
      { $match: { 'players._id': id } },
      { $unwind: '$players' },
      { $match: { 'players._id': id } },
      {
        $group: {
          _id         : null,
          totalMinutes: { $sum: '$players.minutes' },
          totalGoals  : { $sum: '$players.goals' },
          totalAssist : { $sum: '$players.assist' },
          totalMatches: { $sum: 1 }
        }
      }
    ]).exec().catch((error) => {
      throw new InternalServerErrorException(error.message, 'players/total-stats/query-error');
    });

    /!** Get the player model *!/
    const playerUpdateModel = getModel(this.connection, PlayerModel.collection.name, PlayerSchema);

    /!** Save the variables returned by the aggregation *!/
    const { totalMinutes, totalGoals, totalAssist, totalMatches } = aggregate[0];

    /!** Update player record *!/
    playerUpdateModel.findByIdAndUpdate(id, {
      totalGoals  : totalGoals,
      totalMinutes: totalMinutes,
      totalAssist : totalAssist,
      totalMatches: totalMatches
    }).exec().catch(err => {
      console.error('Player not found', err);
    });

    /!** Return *!/
    return { totalGoals, totalMinutes, totalAssist, totalMatches };

  }*/

}
