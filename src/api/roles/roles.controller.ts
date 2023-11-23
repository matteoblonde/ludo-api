import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { Role } from '../../database/models/Role/Role';

import { AccessTokenGuard } from '../auth/guards';
import { RolesService } from './roles.service';


const parser = new MongooseQueryParser();

@ApiTags('Roles')
@Controller('roles')
export class RolesController {

  constructor(
    private rolesService: RolesService
  ) {
  }


  /**
   * Endpoint to insert a record in mongoDB Database
   * @param role
   */
  @UseGuards(AccessTokenGuard)
  @Post()
  public async insertNewRole(
    @Body() role: Role
  ) {
    return this.rolesService.insertNewRole(role);
  }


  /**
   * Endpoint to update one Role into mongoDB Database
   * @param id
   * @param role
   */
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  public async updateTeam(
    @Param('id') id: string,
    @Body() role: Role
  ) {

    return this.rolesService.updateOneRole(id, role);

  }


  /**
   * Endpoint to delete one Role from mongoDB Database
   * @param id
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async deleteRole(
    @Param('id') id: string
  ) {

    return this.rolesService.deleteRole(id);

  }


  /**
   * Endpoint to dynamically query mongoDB Database
   * @param query
   */
  @UseGuards(AccessTokenGuard)
  @Get()
  public async getRoles(
    @Query() query: string
  ) {
    return this.rolesService.getRoles(parser.parse(query));
  }


}
