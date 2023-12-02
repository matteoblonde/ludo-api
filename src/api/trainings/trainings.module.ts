import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';
import { DATABASE_CONNECTION } from '../../database/database.providers';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import LabelTypeSchema from '../../database/models/LabelType/LabelType.Schema';
import TrainingModel from '../../database/models/Training/Training';
import TrainingSchema from '../../database/models/Training/Training.Schema';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { NotificationsService } from '../notifications/notifications.service';
import { TrainingsController } from './trainings.controller';
import { TrainingsService } from './trainings.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ TrainingsController ],
  providers  : [
    TrainingsService,
    {
      provide   : LabelTypeModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(LabelTypeModel.collection.name, LabelTypeSchema)
    },
    {
      provide   : TrainingModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(TrainingModel.collection.name, TrainingSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule,
    NotificationsModule
  ]
})
export class TrainingsModule {
}
