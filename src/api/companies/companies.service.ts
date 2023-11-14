import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';
import CompanyModel, { Company } from '../../database/models/Company/Company';


export class CompaniesService {

  constructor(
    @Inject(CompanyModel.collection.name)
    private readonly companyModel: typeof CompanyModel
  ) {

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
   * Get exercises from Database
   * @param queryOptions
   */
  public async getCompanies(queryOptions?: QueryOptions) {

    /** Extract Query Options */
    const {
      filter,
      sort,
      limit,
      skip
    } = queryOptions || {};

    /** Build the query */
    let query = this.companyModel.find(filter);

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
      throw new InternalServerErrorException(error, 'companies/query-error');
    }

    return docs;

  }

}
