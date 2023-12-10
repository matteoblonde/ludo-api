import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';

import { DATABASE_CONNECTION } from '../../database/database.providers';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import LabelTypeSchema from '../../database/models/LabelType/LabelType.Schema';
import MatchModel from '../../database/models/Match/Match';
import MatchSchema from '../../database/models/Match/Match.schema';

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
    {
      provide   : LabelTypeModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(LabelTypeModel.collection.name, LabelTypeSchema)
    },
    {
      provide   : MatchModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(MatchModel.collection.name, MatchSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule,
    PlayersModule
  ]
})
export class MatchesModule {
}
