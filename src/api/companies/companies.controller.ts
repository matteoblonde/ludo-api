import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import slugify from 'slugify';
import { Company } from '../../database/models/Company/Company';
import { UserData } from '../auth/decorators';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { CompaniesService } from './companies.service';


const parser = new MongooseQueryParser();

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {

  constructor(
    private companiesService: CompaniesService
  ) {
  }


  //TODO: Definire se utilizzare una sicurezza per le chiamate di creazione company e user, oppure come fare?
  /**
   * Endpoint to insert a record in mongoDB Database
   * @param company
   */
  @Post()
  public async insertNewCompany(
    @Body() company: Company
  ) {
    return this.companiesService.insertNewCompany(company);
  }


  /**
   * Update the current season for a company.
   *
   * @param {string} companyId - The ID of the company.
   * @param {string} seasonId - The ID of the season.
   * @returns {Promise<void>} - A promise that resolves when the current season is updated.
   *
   * @UseGuards(AccessTokenGuard)
   * @Patch(':companyId/set-current-season/:seasonId')
   */
  @UseGuards(AccessTokenGuard)
  @Patch(':companyId/set-current-season/:seasonId')
  public async updateCurrentSeason(
    @Param('companyId') companyId: string,
    @Param('seasonId') seasonId: string
  ): Promise<Object> {
    return this.companiesService.updateCurrentSeason(companyId, seasonId);
  }


  /**
   * Endpoint to update one record into mongoDB Database
   * @param id
   * @param company
   */
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  public async updateCompany(
    @Param('id') id: string,
    @Body() company: Company
  ) {
    return this.companiesService.updateOneCompany(id, company);

  }


  /**
   * Endpoint to delete one record from mongoDB Database
   * @param id
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async deleteCompany(
    @Param('id') id: string
  ) {
    return this.companiesService.deleteCompany(id);

  }


  /**
   * Endpoint to dynamically query mongoDB Database
   * @param query
   */
  @Get('slugify')
  public async getCompanies(
    @Query() query: string
  ) {
    return this.companiesService.get([], parser.parse(query));
  }


  /**
   * Endpoint to retrieve user logged company using access token
   */
  @Get('user-company')
  @UseGuards(AccessTokenGuard)
  public async getUserCompany(
    @UserData() userData: IUserData
  ) {
    return this.companiesService.getUserCompany(userData);
  }


}
