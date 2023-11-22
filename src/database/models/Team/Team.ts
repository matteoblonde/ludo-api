import { ArraySubDocumentType, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import PlayerModel from '../Player/Player';
import { User } from '../User/User';


@modelOptions({ schemaOptions: { collection: 'teams' } })
export class Team {

  @prop()
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
