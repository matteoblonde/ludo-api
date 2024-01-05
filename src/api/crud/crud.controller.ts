import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { UserData } from '../auth/decorators';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { CrudService } from './crud.service';


const parser = new MongooseQueryParser();

@ApiTags('Crud')
@Controller('crud')
@UseInterceptors(HttpCacheInterceptor)
export class CrudController {

  constructor(
    private crudService: CrudService
  ) {
  }


  /**
   * Inserts a new record into the system.
   *
   * @param {object} record - The record to be inserted.
   *
   * @param collection
   * @return {Promise<any>} - A promise that resolves with the inserted record.
   *
   * @UseGuards(AccessTokenGuard)
   * @Post()
   * async insertNewRecord(record: any): Promise<any> {
   *   // Forward the record to the crudService for insertion
   *   return this.crudService.insertNewRecord(record);
   * }
   */
  @UseGuards(AccessTokenGuard)
  @Post(':collection')
  public async insertNewRecord(
    @Body() record: any,
    @Param('collection') collection: string
  ): Promise<any> {
    return this.crudService.insertNewRecord(record);
  }


  /**
   * Inserts a new record.
   *
   * @param {Object} record - The record to be inserted.
   * @param collection
   * @param season
   * @param {Object} userData - The user data.
   * @return {Promise} A promise that resolves when the new record is inserted.
   * @throws {Error} If an error occurs during the insertion process.
   */
  @UseGuards(AccessTokenGuard)
  @Post(':collection/labels/:season')
  public async insertNewRecordWithLabels(
    @Body() record: any,
    @Param('collection') collection: string,
    @Param('season') season: boolean,
    @UserData() userData: IUserData
  ): Promise<any> {

    /** If season inject in the record */
    if (season) {
      record = { season: userData.currentSeason, ...record };
    }

    return this.crudService.insertNewRecordWithLabels({ teams: userData.teams, userId: userData.userId, ...record });
  }


  /**
   * Replace a document in a collection by its ID.
   *
   * @param {string} id - The ID of the document to replace.
   * @param collection
   * @param {any} document - The new document to replace the existing one.
   * @returns {Promise<any>} A promise that resolves to the replaced document.
   *
   * @UseGuards(AccessTokenGuard)
   * @Put(':id')
   * public async replaceDocumentInCollection(
   *   @Body() document: any
   * ) {
   *   return this.crudService.replaceDocumentById(id, document);
   * }
   */
  @UseGuards(AccessTokenGuard)
  @Put(':collection/:id')
  public async replaceDocumentInCollection(
    @Param('id') id: string,
    @Param('collection') collection: string,
    @Body() document: any
  ): Promise<any> {
    return this.crudService.replaceDocumentById(id, document);
  }


  /**
   * Updates a specific field in a document.
   *
   * @param collection - The name of the collection where the document is stored.
   * @param documentId - The unique identifier of the document to be updated.
   * @param field - The name of the field to be updated.
   * @param value - The new value to assign to the field.
   * @returns A Promise that resolves to the updated document.
   */
  @UseGuards(AccessTokenGuard)
  @Patch(':collection/:id/:field')
  public async updateFieldInDocument(
    @Param('collection') collection: string,
    @Param('id') documentId: string,
    @Param('field') field: string,
    @Body() value: any
  ) {
    return this.crudService.updateFieldInDocument(documentId, field, value);
  }


  /**
   * Deletes a document by its ID.
   *
   * @param {string} documentId - The ID of the document to delete.
   *
   * @param collection
   * @returns {Promise<any>} - A Promise that resolves when the document is deleted.
   *
   * @example
   * // Usage example
   * const documentId = '12345';
   * await deleteDocumentById(documentId);
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':collection/:id')
  public async deleteDocumentById(
    @Param('id') documentId: string,
    @Param('collection') collection: string
  ): Promise<any> {
    return this.crudService.deleteDocumentById(documentId);
  }


  /**
   * Retrieves documents from the CRUD service.
   *
   * @UseGuards(AccessTokenGuard)
   * @Get()
   * @param {string} query - The query to filter the documents.
   * @param collection
   * @param season
   * @param {IUserData} userData - The user data obtained from the access token.
   * @return {Promise<any>} - A promise that resolves to the retrieved documents.
   */
  @UseGuards(AccessTokenGuard)
  @Get(':collection/:season')
  public async getDocuments(
    @Query() query: any,
    @Param('collection') collection: string,
    @Param('season') season: boolean,
    @UserData() userData: IUserData
  ): Promise<any> {

    /** If season apply season filter */
    if (season) {
      query.filter = { 'season': userData.currentSeason, ...query.filter };
    }

    /** Apply teams filter if roleLevel is less than 50 */
    const teamFilter = userData.roleLevel < 50 ? userData.teams : [];

    return this.crudService.get(teamFilter, parser.parse(query));
  }


  /**
   * Retrieves documents without applying any teams filter.
   *
   * @param {string} query - The query parameter containing filter parameters.
   * @param {string} collection - The parameter representing the name of the collection.
   *
   * @param season
   * @param userData
   * @returns {Promise<any>} - A promise that resolves to the retrieved documents.
   *
   * @UseGuards(AccessTokenGuard)
   * @Get(':collection/settings')
   */
  @UseGuards(AccessTokenGuard)
  @Get(':collection/no-team-filter/:season')
  public async getDocumentsWithoutTeamsFilter(
    @Query() query: any,
    @Param('collection') collection: string,
    @Param('season') season: boolean,
    @UserData() userData: IUserData
  ): Promise<any> {

    /** If season apply season filter */
    if (season) {
      query.filter = { 'season': userData.currentSeason, ...query.filter };
    }

    return this.crudService.get([], parser.parse(query));
  }

}
