import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';


@modelOptions({ schemaOptions: { collection: 'playerRoles' } })
export class PlayerRole {

  @prop({ required: true })
  public userId!: string;

  @prop()
  public roleName?: string;

  @prop()
  public order?: number;

}

const PlayerRoleModel = getModelForClass(PlayerRole);

/* --------
* Module Exports
* -------- */
export default PlayerRoleModel;
