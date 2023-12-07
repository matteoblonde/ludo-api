import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';

import { DatabaseModule } from '../../database/database.module';
import { DATABASE_CONNECTION } from '../../database/database.providers';

import NotificationModel from '../../database/models/Notification/Notification';
import NotificationSchema from '../../database/models/Notification/Notification.Schema';

import { AuthModule } from '../auth/auth.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

/* --------
 * Module Definition
 * -------- */
@Module({
  controllers: [ NotificationsController ],
  providers  : [
    NotificationsService,
    {
      provide   : NotificationModel.collection.name,
      inject    : [ DATABASE_CONNECTION ],
      useFactory: (connection: Connection) => connection.model(NotificationModel.collection.name, NotificationSchema)
    }
  ],
  imports    : [
    DatabaseModule,
    AuthModule
  ],
  exports    : [ NotificationsService ]
})
export class NotificationsModule {
}
