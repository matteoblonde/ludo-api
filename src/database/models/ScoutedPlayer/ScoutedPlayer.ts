/* --------
* Define the class
* -------- */
import {
  ArraySubDocumentType,
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
  Severity
} from '@typegoose/typegoose';
import { Residence } from '../../interfaces';
import { Contact } from '../Contact/Contact';
import { Label } from '../Label/Label';
import PlayerModel from '../Player/Player';
import { PlayerAttribute } from '../PlayerAttribute/PlayerAttribute';
import { PlayerRole } from '../PlayerRole/PlayerRole';
import { ScoutingStatus } from '../ScoutingStatus/ScoutingStatus';


@modelOptions({ schemaOptions: { collection: 'scoutedPlayers' } })
export class ScoutedPlayer {

  @prop()
  public userId?: string;

  @prop()
  public firstName?: string;

  @prop()
  public lastName?: string;

  @prop()
  public currentTeam?: string;

  @prop()
  public notes?: string;

  @prop({
    default: 0
  })
  public value!: number;

  @prop()
  public birthDate?: Date;

  @prop()
  public firstContactDate?: Date;

  @prop({ allowMixed: Severity.ALLOW })
  public scoutingStatus?: DocumentType<ScoutingStatus>;

  @prop({ allowMixed: Severity.ALLOW })
  public contacts?: ArraySubDocumentType<Contact>;

  @prop({ allowMixed: Severity.ALLOW })
  public labels?: ArraySubDocumentType<Label>;

  @prop({ allowMixed: Severity.ALLOW })
  public attributes?: ArraySubDocumentType<PlayerAttribute>;

  @prop({
    default   : {
      address   : '',
      city      : '',
      postalCode: '',
      country   : ''
    },
    allowMixed: Severity.ALLOW
  })
  public residence?: DocumentType<Residence>;

  @prop({ allowMixed: Severity.ALLOW })
  public roles?: ArraySubDocumentType<PlayerRole>;

}

/**
 * Get Model from Class
 */
const ScoutedPlayerModel = getModelForClass(ScoutedPlayer);

/* --------
* Module Exports
* -------- */
export default ScoutedPlayerModel;
