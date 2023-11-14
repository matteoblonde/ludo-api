import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';

import { DATABASE_CONNECTION } from '../../database/database.providers';
import ExerciseTypeModel from '../../database/models/ExerciseType/ExerciseType';
import ExerciseTypeSchema from '../../database/models/ExerciseType/ExerciseType.schema';

import { AuthModule } from '../auth/auth.module';
import { ExerciseTypesController } from './exercise-types.controller';
import { ExerciseTypesService } from './exercise-types.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ ExerciseTypesController ],
  providers  : [
    ExerciseTypesService,
    {
      provide   : ExerciseTypeModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(ExerciseTypeModel.collection.name, ExerciseTypeSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class ExerciseTypesModule {
}
