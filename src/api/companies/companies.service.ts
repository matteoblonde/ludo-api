import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';

import CompanyModel, { Company } from '../../database/models/Company/Company';
import SeasonModel from '../../database/models/Season/Season';
import UserModel from '../../database/models/User/User';
import { AbstractedCrudService } from '../abstractions/abstracted-crud.service';
import { IUserData } from '../auth/interfaces/UserData';


export class CompaniesService extends AbstractedCrudService<Company> {

  constructor(
    @Inject(CompanyModel.collection.name)
    private readonly companyModel: typeof CompanyModel,
    @Inject(UserModel.collection.name)
    private readonly userModel: typeof UserModel,
    @Inject(SeasonModel.collection.name)
    private readonly seasonModel: typeof SeasonModel
  ) {
    super(companyModel);
  }


  /**
   * Insert new company into database
   * @param company
   */
  public async insertNewCompany(company: Company) {

    /**
     * Build the final record
     */
    const record = new this.companyModel(company);

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

  }


  /**
   * Update the current season for a company and its users.
   *
   * @param {string} companyId - The ID of the company to update.
   * @param {string} seasonId - The ID of the new current season.
   * @return {Promise<object>} A promise that resolves to an object with the updated company ID and a success message.
   * @throws {BadRequestException} If the company is not found.
   */
  public async updateCurrentSeason(companyId: string, seasonId: string): Promise<object> {

    /** Update the company */
    await this.companyModel.findByIdAndUpdate(companyId, { 'currentSeason': seasonId });

    /** Update users */
    await this.userModel.updateMany({ 'company': companyId }, { $set: { 'currentSeason': seasonId } });

    /** Update old season */
    await this.seasonModel.findOneAndUpdate(
      { 'isCurrentSeason': true },
      { 'isCurrentSeason': false }
    );

    /** Update new Season */
    await this.seasonModel.findByIdAndUpdate(seasonId, { 'isCurrentSeason': true }).exec();

    return {
      id     : companyId,
      message: 'Record has been successfully updated'
    };
  }


  /**
   * Update a company into Database
   * @param id
   * @param company
   */
  public async updateOneCompany(id: string, company: Company) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.companyModel.findById(id).exec().then(async (exist: any) => {

      /* If none records found, exit */
      if (exist !== null) {
        await this.companyModel.replaceOne({ _id: id }, company);
      }
      else {
        throw new InternalServerErrorException('Query', 'companies/query-error');
      }
    }).catch(() => {
      throw new BadRequestException(
        'Could not update or create record',
        'invalid fields'
      );
    });

    /* Return the record */
    return company;

  }


  /**
   * Delete one company into Database
   * @param id
   */
  public async deleteCompany(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    await this.companyModel.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }


  /**
   * Function to retrieve user company from Access Token
   * @param userData
   */
  public async getUserCompany(userData: IUserData) {

    const companyId = userData.company;

    return this.companyModel.findById(companyId);

  }

}
