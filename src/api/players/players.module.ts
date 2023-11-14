import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';

import { DATABASE_CONNECTION } from '../../database/database.providers';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import LabelTypeSchema from '../../database/models/LabelType/LabelType.Schema';
import PlayerModel from '../../database/models/Player/Player';
import PlayerSchema from '../../database/models/Player/Player.Schema';
import PlayerStatModel from '../../database/models/PlayerStat/PlayerStat';
import PlayerStatSchema from '../../database/models/PlayerStat/PlayerStat.schema';

import { AuthModule } from '../auth/auth.module';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ PlayersController ],
  providers  : [
    PlayersService,
    {
      provide   : LabelTypeModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(LabelTypeModel.collection.name, LabelTypeSchema)
    },
    {
      provide   : PlayerStatModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(PlayerStatModel.collection.name, PlayerStatSchema)
    },
    {
      provide   : PlayerModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(PlayerModel.collection.name, PlayerSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class PlayersModule {
}
