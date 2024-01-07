import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';

import { DATABASE_CONNECTION, getModel, RouteModelProvider } from '../../database/database.providers';
import AttributeStoryModel from '../../database/models/AttributeStory/AttributeStory';
import AttributeStorySchema from '../../database/models/AttributeStory/AttributeStory.Schema';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import LabelTypeSchema from '../../database/models/LabelType/LabelType.Schema';
import MatchModel from '../../database/models/Match/Match';
import MatchSchema from '../../database/models/Match/Match.schema';
import PlayerAttributeModel from '../../database/models/PlayerAttribute/PlayerAttribute';
import PlayerAttributeSchema from '../../database/models/PlayerAttribute/PlayerAttribute.schema';

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
      useFactory: (connection: Connection) => getModel(connection, LabelTypeModel.collection.name, LabelTypeSchema)
    },
    {
      provide   : AttributeStoryModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(
        connection,
        AttributeStoryModel.collection.name,
        AttributeStorySchema
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
    RouteModelProvider,
    {
      provide   : MatchModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(connection, MatchModel.collection.name, MatchSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ],
  exports    : [ PlayersService ]
})
export class PlayersModule {
}
