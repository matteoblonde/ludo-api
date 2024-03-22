/* --------
* Schema Definition
* -------- */
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';


@modelOptions({ schemaOptions: { collection: 'maybeUsers' } })
export class MaybeUser {

  @prop({
    required: true
  })
  public firstName!: string;

  @prop({
    required: true
  })
  public lastName!: string;

  @prop({
    required: true
  })
  public email!: string;

  @prop({
    required: true
  })
  public message!: string;

}

const MaybeUserModel = getModelForClass(MaybeUser);

/* --------
* Module Exports
* -------- */
export default MaybeUserModel;
