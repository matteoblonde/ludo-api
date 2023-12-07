import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';


@modelOptions({ schemaOptions: { collection: 'notifications' } })
export class Notification {

  @prop()
  public userId?: string;

  @prop()
  public teams?: string[];

  @prop()
  public title?: string;

  @prop()
  public description?: string;

  @prop()
  public routerLink?: string;

  @prop({
    default: new Date().getDate() + 7
  })
  public expireDatetime?: Date;

}

/**
 * Get Model from Class
 */
const NotificationModel = getModelForClass(Notification);

/* --------
* Module Exports
* -------- */
export default NotificationModel;
