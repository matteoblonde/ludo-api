import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';

import { RouteModelProvider } from '../../database/database.providers';

import { AuthModule } from '../auth/auth.module';
import { PlayersModule } from '../players/players.module';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ MatchesController ],
  providers  : [
    MatchesService,
    RouteModelProvider
  ],
  imports    : [
    DatabaseModule,
    AuthModule,
    PlayersModule
  ]
})
export class MatchesModule {
}
