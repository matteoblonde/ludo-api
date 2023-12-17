import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';
import PlayerRoleModel, { PlayerRole } from '../../database/models/PlayerRole/PlayerRole';
import { AbstractedCrudService } from '../abstractions/abstracted-crud.service';


export class PlayerRolesService extends AbstractedCrudService<PlayerRole> {

  constructor(
    @Inject(PlayerRoleModel.collection.name)
    private readonly playerRoleModel: typeof PlayerRoleModel
  ) {
    super(playerRoleModel);
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

}
