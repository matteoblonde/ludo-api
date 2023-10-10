import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';
import { DATABASE_CONNECTION, DatabaseConnectionProvider } from '../../database/database.providers';
import ExerciseModel from '../../database/models/Exercise/Exercise';
import ExerciseSchema from '../../database/models/Exercise/Exercise.Schema';
import { AuthModule } from '../auth/auth.module';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';

import UserModel from '../../database/models/User/User';
import UserSchema from '../../database/models/User/User.Schema';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ ExercisesController ],
  providers  : [
    ExercisesService,
    {
      provide   : ExerciseModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(ExerciseModel.collection.name, ExerciseSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class ExercisesModule {
}
