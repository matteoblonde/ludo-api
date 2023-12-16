import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';

import { DATABASE_CONNECTION } from '../../database/database.providers';
import TrainingAbsenceModel from '../../database/models/TrainingAbsence/TrainingAbsence';
import TrainingAbsenceSchema from '../../database/models/TrainingAbsence/TrainingAbsence.Schema';

import { AuthModule } from '../auth/auth.module';
import { TrainingAbsencesController } from './training-absences.controller';
import { TrainingAbsencesService } from './training-absences.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ TrainingAbsencesController ],
  providers  : [
    TrainingAbsencesService,
    {
      provide: TrainingAbsenceModel.collection.name,
      inject: [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(
        TrainingAbsenceModel.collection.name,
        TrainingAbsenceSchema
      )
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ]
})
export class TrainingAbsencesModule {
}
