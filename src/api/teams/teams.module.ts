import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';

import { DATABASE_CONNECTION, systemDatabaseConnection } from '../../database/database.providers';

import TeamModel from '../../database/models/Team/Team';
import TeamSchema from '../../database/models/Team/Team.schema';
import UserModel from '../../database/models/User/User';
import UserSchema from '../../database/models/User/User.Schema';

import { AuthModule } from '../auth/auth.module';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ TeamsController ],
  providers  : [
    TeamsService,
    {
      provide   : TeamModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(TeamModel.collection.name, TeamSchema)
    },
    {
      provide   : UserModel.collection.name,
      useFactory: () => systemDatabaseConnection.model(UserModel.collection.name, UserSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class TeamsModule {
}
