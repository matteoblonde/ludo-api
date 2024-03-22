import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';

import { systemDatabaseConnection } from '../../database/database.providers';
import MaybeUserModel from '../../database/models/MaybeUser/MaybeUser';
import MaybeUserSchema from '../../database/models/MaybeUser/MaybeUser.Schema';

import { AuthModule } from '../auth/auth.module';
import { MaybeUsersController } from './maybe-users.controller';
import { MaybeUsersService } from './maybe-users.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ MaybeUsersController ],
  providers  : [
    MaybeUsersService,
    {
      provide   : MaybeUserModel.collection.name,
      useFactory: () => systemDatabaseConnection.model(MaybeUserModel.collection.name, MaybeUserSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class MaybeUsersModule {
}
