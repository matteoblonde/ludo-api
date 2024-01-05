import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';

import { DATABASE_CONNECTION, getModel, systemDatabaseConnection } from '../../database/database.providers';
import TeamModel from '../../database/models/Team/Team';
import TeamSchema from '../../database/models/Team/Team.schema';
import UserModel from '../../database/models/User/User';
import UserSchema from '../../database/models/User/User.Schema';

import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ UsersController ],
  providers  : [
    UsersService,
    {
      provide   : UserModel.collection.name,
      useFactory: () => systemDatabaseConnection.model(UserModel.collection.name, UserSchema)
    },
    {
      provide   : TeamModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(connection, TeamModel.collection.name, TeamSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class UsersModule {
}
