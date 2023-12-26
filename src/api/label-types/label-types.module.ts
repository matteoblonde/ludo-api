import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';

import { RouteModelProvider } from '../../database/database.providers';

import { AuthModule } from '../auth/auth.module';
import { LabelTypesController } from './label-types.controller';
import { LabelTypesService } from './label-types.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ LabelTypesController ],
  providers  : [
    LabelTypesService,
    RouteModelProvider
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class LabelTypesModule {
}
