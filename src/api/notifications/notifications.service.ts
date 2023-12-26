import { Inject, Injectable } from '@nestjs/common';

import NotificationModel, { Notification } from '../../database/models/Notification/Notification';
import { AbstractedCrudService } from '../abstractions/abstracted-crud.service';


@Injectable()
export class NotificationsService extends AbstractedCrudService<Notification> {

  constructor(
    @Inject(NotificationModel.collection.name)
    private readonly notificationModel: typeof NotificationModel
  ) {
    super(notificationModel);
  }


  /**
   * Insert new notification into database
   * @param notification
   */
  public async insertNewNotification(notification: Notification) {

    /**
     * Build the final record
     */
    const record = new this.notificationModel(notification);

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

  }

}
