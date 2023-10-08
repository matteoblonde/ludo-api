import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import UserModel from '../../database/models/User/User';
import UserSchema from '../../database/models/User/User.Schema';

import { AccessTokenGuard } from './guards';

import { DatabaseModule } from '../../database/database.module';

import { TokenModule } from '../../token/token.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { AccessTokenService } from '../../token/services/access-token.service';

import { DATABASE_CONNECTION } from '../../database/database.providers';


@Module({

  providers: [
    AuthService,
    AccessTokenGuard,
    AccessTokenService,
    {
      provide   : UserModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(UserModel.collection.name, UserSchema)
    }
  ],

  imports: [
    DatabaseModule,
    TokenModule
  ],

  controllers: [ AuthController ],

  exports: [ AuthService, AccessTokenGuard, AccessTokenService ]

})
export class AuthModule {
}
