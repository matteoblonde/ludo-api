import {
  ArraySubDocumentType,
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
  Severity
} from '@typegoose/typegoose';
import { Residence } from '../../interfaces';
import { Document } from '../Document/Document';
import { Label } from '../Label/Label';
import { PlayerAttribute } from '../PlayerAttribute/PlayerAttribute';
import { PlayerRole } from '../PlayerRole/PlayerRole';


/* --------
* Define the class
* -------- */
@modelOptions({ schemaOptions: { collection: 'players' } })
export class Player {

  @prop()
  public userId?: string;

  @prop({ allowMixed: Severity.ALLOW })
  public teams?: string[];

  @prop()
  public currentTeam?: string;

  @prop()
  public firstName?: string;

  @prop()
  public lastName?: string;

  @prop()
  public playerImgUrl?: string;

  @prop()
  public height?: number;

  @prop()
  public weight?: number;

  @prop({
    default: 60
  })
  public value?: number;

  @prop({
    default   : [ 'Right' ],
    allowMixed: Severity.ALLOW
  })
  public foot?: string[];

  @prop()
  public notes?: string;

  @prop()
  public shirtNumber?: number;

  @prop({ allowMixed: Severity.ALLOW })
  public labels?: ArraySubDocumentType<Label>;

  @prop({ allowMixed: Severity.ALLOW })
  public roles?: ArraySubDocumentType<PlayerRole>;

  @prop({ allowMixed: Severity.ALLOW })
  public attributes?: ArraySubDocumentType<PlayerAttribute>;

  /** Fields for personal details */
  @prop()
  public birthDate?: Date;

  @prop({ allowMixed: Severity.ALLOW })
  public documents?: ArraySubDocumentType<Document>;

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

  /** Field for the analysis */
  @prop({
    default: 0
  })
  public totalGoals?: number;

  @prop({
    default: 0
  })
  public totalAssist?: number;

  @prop({
    default: 0
  })
  public totalMinutes?: number;

  @prop({
    default: 0
  })
  public totalMatches?: number;

  /** Field defined only in the match context */
  @prop({
    default: 0
  })
  public goals?: number;

  @prop({
    default: 0
  })
  public minutes?: number;

  @prop({
    default: 0
  })
  public assist?: number;

  @prop({
    default: 0
  })
  public rating?: number;

  @prop()
  public matchNotes?: string;

}

/**
 * Get Model from Class
 */
const PlayerModel = getModelForClass(Player);

/* --------
* Module Exports
* -------- */
export default PlayerModel;
