import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';

import { systemDatabaseConnection } from '../../database/database.providers';
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
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class UsersModule {
}
