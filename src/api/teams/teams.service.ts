import { Inject } from '@nestjs/common';
import mongoose from 'mongoose';
import { ROUTE_MODEL } from '../../database/database.providers';

import { Team } from '../../database/models/Team/Team';
import { AbstractedCrudService } from '../abstractions/abstracted-crud.service';


export class TeamsService extends AbstractedCrudService<Team> {

  constructor(
    @Inject(ROUTE_MODEL)
    private readonly teamModel: mongoose.Model<any>
  ) {
    super(teamModel);
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
