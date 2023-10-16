import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';
import { DATABASE_CONNECTION } from '../../database/database.providers';
import ExerciseModel from '../../database/models/Exercise/Exercise';
import ExerciseSchema from '../../database/models/Exercise/Exercise.Schema';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import LabelTypeSchema from '../../database/models/LabelType/LabelType.Schema';
import { AuthModule } from '../auth/auth.module';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ ExercisesController ],
  providers  : [
    ExercisesService,
    {
      provide   : LabelTypeModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(LabelTypeModel.collection.name, LabelTypeSchema)
    },
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
