import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { DatabaseModule } from '../../database/database.module';
import {
  DATABASE_CONNECTION, getModel,
  systemDatabaseConnection
} from '../../database/database.providers';
import ExerciseModel from '../../database/models/Exercise/Exercise';
import ExerciseSchema from '../../database/models/Exercise/Exercise.Schema';
import MatchModel from '../../database/models/Match/Match';
import MatchSchema from '../../database/models/Match/Match.schema';
import PlayerModel from '../../database/models/Player/Player';
import PlayerSchema from '../../database/models/Player/Player.Schema';
import TrainingModel from '../../database/models/Training/Training';
import TrainingSchema from '../../database/models/Training/Training.Schema';
import UserModel from '../../database/models/User/User';
import UserSchema from '../../database/models/User/User.Schema';
import { AuthModule } from '../auth/auth.module';
import { DataCenterController } from './data-center.controller';
import { DataCenterService } from './data-center.service';


@Module({
  controllers: [ DataCenterController ],
  providers  : [
    DataCenterService,
    {
      provide   : PlayerModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(connection, PlayerModel.collection.name, PlayerSchema)
    },
    {
      provide   : MatchModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(connection, MatchModel.collection.name, MatchSchema)
    },
    {
      provide   : TrainingModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(connection, TrainingModel.collection.name, TrainingSchema)
    },
    {
      provide   : ExerciseModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => getModel(connection, ExerciseModel.collection.name, ExerciseSchema)
    },
    {
      provide   : UserModel.collection.name,
      useFactory: () => systemDatabaseConnection.model(UserModel.collection.name, UserSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class DataCenterModule {

}
