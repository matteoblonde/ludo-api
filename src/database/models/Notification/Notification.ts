import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';


@modelOptions({ schemaOptions: { collection: 'notifications' } })
export class Notification {

  @prop()
  public userId?: string;

  @prop({ allowMixed: Severity.ALLOW })
  public teams?: string[];

  @prop()
  public title?: string;

  @prop()
  public description?: string;

  @prop()
  public routerLink?: string;

  @prop({
    default: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
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
