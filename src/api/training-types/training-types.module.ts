import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';

import { DATABASE_CONNECTION } from '../../database/database.providers';
import TrainingTypeModel from '../../database/models/TrainingType/TrainingType';
import TrainingTypeSchema from '../../database/models/TrainingType/TrainingType.schema';

import { AuthModule } from '../auth/auth.module';
import { TrainingTypesController } from './training-types.controller';
import { TrainingTypesService } from './training-types.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ TrainingTypesController ],
  providers  : [
    TrainingTypesService,
    {
      provide   : TrainingTypeModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(TrainingTypeModel.collection.name, TrainingTypeSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class TrainingTypesModule {
}
