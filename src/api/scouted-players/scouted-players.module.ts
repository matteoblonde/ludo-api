import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';

import { DATABASE_CONNECTION, getModel, RouteModelProvider } from '../../database/database.providers';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import LabelTypeSchema from '../../database/models/LabelType/LabelType.Schema';
import PlayerAttributeModel from '../../database/models/PlayerAttribute/PlayerAttribute';
import PlayerAttributeSchema from '../../database/models/PlayerAttribute/PlayerAttribute.schema';
import ScoutingStatusModel from '../../database/models/ScoutingStatus/ScoutingStatus';
import ScoutingStatusSchema from '../../database/models/ScoutingStatus/ScoutingStatus.Schema';

import { AuthModule } from '../auth/auth.module';
import { ScoutedPlayersController } from './scouted-players.controller';
import { ScoutedPlayersService } from './scouted-players.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ ScoutedPlayersController ],
  providers  : [
    ScoutedPlayersService,
    {
      provide   : LabelTypeModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(connection, LabelTypeModel.collection.name, LabelTypeSchema)
    },
    {
      provide   : ScoutingStatusModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(
        connection,
        ScoutingStatusModel.collection.name,
        ScoutingStatusSchema
      )
    },
    {
      provide   : PlayerAttributeModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(
        connection,
        PlayerAttributeModel.collection.name,
        PlayerAttributeSchema
      )
    },
    RouteModelProvider
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ],
  exports    : [ ScoutedPlayersService ]
})
export class ScoutedPlayersModule {
}
