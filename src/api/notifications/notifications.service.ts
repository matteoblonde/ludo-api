import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { will } from '@proedis/utils';
import { QueryOptions } from 'mongoose-query-parser';

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


  /**
   * Update a notification into Database
   * @param id
   * @param notification
   */
  public async updateOneNotification(id: string, notification: Notification) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.notificationModel.findById(id).exec().then(async (exist: any) => {

      /* If none records found, exit */
      if (exist !== null) {
        await this.notificationModel.replaceOne({ _id: id }, notification);
      }
      else {
        return;
      }
    }).catch(() => {
      throw new BadRequestException(
        'Could not update or create record',
        'invalid fields'
      );
    });

    /* Return a JSON with ID and message */
    return {
      id     : id,
      message: 'Record has been successfully updated'
    };

  }


  /**
   * Delete one notification into Database
   * @param id
   */
  public async deleteNotification(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    await this.notificationModel.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }

}
