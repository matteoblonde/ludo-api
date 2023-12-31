import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { S3Service } from '../../aws';

import { DatabaseModule } from '../../database/database.module';
import { DATABASE_CONNECTION, RouteModelProvider } from '../../database/database.providers';
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
    S3Service,
    {
      provide   : LabelTypeModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(LabelTypeModel.collection.name, LabelTypeSchema)
    },
    RouteModelProvider
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class ExercisesModule {
}
