import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';

import TeamModel, { Team } from '../../database/models/Team/Team';
import UserModel from '../../database/models/User/User';
import { AbstractedCrudService } from '../abstractions/abstracted-crud.service';


export class TeamsService extends AbstractedCrudService<Team> {

  constructor(
    @Inject(TeamModel.collection.name)
    private readonly teamModel: typeof TeamModel,
    @Inject(UserModel.collection.name)
    private readonly userModel: typeof UserModel
  ) {
    super(teamModel);
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
   * Retrieves the teams associated with a user.
   *
   * @param {string} userId - The unique identifier of the user.
   *
   * @return {Promise<Team[]>} - A promise that resolves to an array of Team objects representing the teams associated with the user.
   */
  public async getUserTeams(userId: string): Promise<Team[]> {

    return this.teamModel.find({
      'users._id': userId
    });

  }

}
