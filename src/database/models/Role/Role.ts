import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';


/* --------
* Schema Definition
* -------- */
@modelOptions({ schemaOptions: { collection: 'roles' } })
export class Role {

  @prop()
  public roleName?: string;

  @prop({
    required: true,
    default : 10
  })
  public roleLevel!: number;

}

const RoleModel = getModelForClass(Role);

/* --------
* Module Exports
* -------- */
export default RoleModel;
