import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';

import { DATABASE_CONNECTION } from '../../database/database.providers';
import RoleModel from '../../database/models/Role/Role';
import RoleSchema from '../../database/models/Role/Role.Schema';


import { AuthModule } from '../auth/auth.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ RolesController ],
  providers  : [
    RolesService,
    {
      provide   : RoleModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(RoleModel.collection.name, RoleSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class RolesModule {
}
