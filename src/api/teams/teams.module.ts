import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';

import { RouteModelProvider } from '../../database/database.providers';

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
    RouteModelProvider
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class TeamsModule {
}
