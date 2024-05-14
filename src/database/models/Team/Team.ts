import { ArraySubDocumentType, getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { User } from '../User/User';


@modelOptions({ schemaOptions: { collection: 'teams' } })
export class Team {

  @prop({ allowMixed: Severity.ALLOW, default: [] })
  users?: ArraySubDocumentType<User>;

  @prop()
  teamName?: string;

  @prop()
  teamDescription?: string;

}

/**
 * Get Model from Class
 */
const TeamModel = getModelForClass(Team);

/* --------
* Module Exports
* -------- */
export default TeamModel;
