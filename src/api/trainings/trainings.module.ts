import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';
import { DATABASE_CONNECTION, getModel, RouteModelProvider } from '../../database/database.providers';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import LabelTypeSchema from '../../database/models/LabelType/LabelType.Schema';

import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
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
      useFactory: (connection: Connection) => getModel(connection, LabelTypeModel.collection.name, LabelTypeSchema)
    },
    RouteModelProvider
  ],
  imports    : [
    DatabaseModule,
    AuthModule,
    NotificationsModule
  ]
})
export class TrainingsModule {
}
