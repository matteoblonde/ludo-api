import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';

import { DATABASE_CONNECTION } from '../../database/database.providers';
import PlayerStatModel from '../../database/models/PlayerStat/PlayerStat';
import PlayerStatSchema from '../../database/models/PlayerStat/PlayerStat.schema';

import { AuthModule } from '../auth/auth.module';
import { PlayerStatsController } from './player-stats.controller';
import { PlayerStatsService } from './player-stats.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ PlayerStatsController ],
  providers  : [
    PlayerStatsService,
    {
      provide   : PlayerStatModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(PlayerStatModel.collection.name, PlayerStatSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class PlayerStatsModule {
}
