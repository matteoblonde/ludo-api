import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';
import { Label } from '../../database/models/Label/Label';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import MatchModel, { Match } from '../../database/models/Match/Match';
import { Player } from '../../database/models/Player/Player';


export class MatchesService {

  constructor(
    @Inject(MatchModel.collection.name)
    private readonly matchModel: typeof MatchModel,
    @Inject(LabelTypeModel.collection.name)
    private readonly labelTypeModel: typeof LabelTypeModel
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
   * Function to update only players array in the match
   * @param id
   * @param players
   */
  public async updateMatchPlayers(id: string, players: Player[]) {

    return this.matchModel.findByIdAndUpdate(id, {
      players: players
    });

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
    await this.matchModel.findByIdAndDelete(id);

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
