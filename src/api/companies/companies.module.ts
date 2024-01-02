import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';

import { DATABASE_CONNECTION, systemDatabaseConnection } from '../../database/database.providers';
import CompanyModel from '../../database/models/Company/Company';
import CompanySchema from '../../database/models/Company/Company.Schema';
import SeasonModel from '../../database/models/Season/Season';
import SeasonSchema from '../../database/models/Season/Season.Schema';
import UserModel from '../../database/models/User/User';
import UserSchema from '../../database/models/User/User.Schema';

import { AuthModule } from '../auth/auth.module';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ CompaniesController ],
  providers  : [
    CompaniesService,
    {
      provide   : CompanyModel.collection.name,
      useFactory: () => systemDatabaseConnection.model(CompanyModel.collection.name, CompanySchema)
    },
    {
      provide   : UserModel.collection.name,
      useFactory: () => systemDatabaseConnection.model(UserModel.collection.name, UserSchema)
    },
    {
      provide   : SeasonModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(SeasonModel.collection.name, SeasonSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class CompaniesModule {
}
