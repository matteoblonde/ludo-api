import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';

import { DATABASE_CONNECTION, systemDatabaseConnection } from '../../database/database.providers';
import CompanyModel from '../../database/models/Company/Company';
import CompanySchema from '../../database/models/Company/Company.Schema';

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
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class CompaniesModule {
}
