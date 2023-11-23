import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';


/* --------
* Schema Definition
* -------- */
@modelOptions({ schemaOptions: { collection: 'roles' } })
export class Role {

  @prop()
  public roleName?: string;

  @prop()
  public roleDescription?: string;

  @prop({
    required: true,
    default : 10
  })
  public roleLevel!: number;

  @prop({
    allowMixed: Severity.ALLOW,
    required  : true,
    default   : [ 'exercises', 'trainings', 'matches', 'players' ]
  })
  sections!: string[];

}

const RoleModel = getModelForClass(Role);

/* --------
* Module Exports
* -------- */
export default RoleModel;
