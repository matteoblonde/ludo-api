import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import TeamModel from '../../database/models/Team/Team';
import UserModel, { User } from '../../database/models/User/User';
import { AbstractedCrudService } from '../abstractions/abstracted-crud.service';


export class UsersService extends AbstractedCrudService<User> {

  constructor(
    @Inject(UserModel.collection.name)
    private readonly userModel: typeof UserModel,
    @Inject(TeamModel.collection.name)
    private readonly teamModel: typeof TeamModel
  ) {
    super(userModel);
  }


  /**
   * Insert new user into database
   * @param user
   */
  public async insertNewUser(user: User) {

    /**
     * Build the final record
     */
    const record = new this.userModel(user);

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

  }


  /**
   * Update a User into Database
   * @param id
   * @param user
   */
  public async updateOneUser(id: string, user: User) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.userModel.findById(id).exec().then(async (exist: any) => {

      /* If none records found, exit */
      if (exist !== null) {
        await this.userModel.replaceOne({ _id: id }, user);
      }
      else {
        throw new InternalServerErrorException('Query', 'users/query-error');
      }
    }).catch(() => {
      throw new BadRequestException(
        'Could not update or create record',
        'invalid fields'
      );
    });

    /* Return the record */
    return user;

  }


  /**
   * Delete one user into Database
   * @param id
   */
  public async deleteUser(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Remove user from all the teams */
    await this.teamModel.updateMany(
      { 'users._id': id },
      { $pull: { users: { _id: id } } }
    );

    /** Call mongoose method to delete document */
    await this.userModel.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }

}
