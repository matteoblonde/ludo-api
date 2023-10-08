import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';


/* --------
* Schema Definition
* -------- */
@modelOptions({ schemaOptions: { collection: 'roles' }, options: { customName: 'roles' } })
export class Role {

  @prop({ required: true })
  public _id!: string;

  @prop()
  public roleName?: string;

  @prop({
    default: 10
  })
  public roleLevel?: number;

}

const RoleModel = getModelForClass(Role);

/* --------
* Module Exports
* -------- */
export default RoleModel;
