import {
  ArraySubDocumentType,
  getModelForClass,
  modelOptions,
  prop,
  Severity,
  SubDocumentType
} from '@typegoose/typegoose';
import { Label } from '../Label/Label';
import { Player } from '../Player/Player';
import { Team } from '../Team/Team';


@modelOptions({ schemaOptions: { collection: 'matches' } })
export class Match {

  @prop()
  userId?: string;

  @prop()
  public teams?: string[];

  @prop()
  matchName?: string;

  @prop({ allowMixed: Severity.ALLOW })
  team?: SubDocumentType<Team>;

  @prop()
  opposingTeamName?: string;

  @prop({
    default: new Date()
  })
  matchDateTime?: Date;

  @prop({
    default: new Date()
  })
  meetingDateTime?: Date;


  @prop()
  address?: string;

  @prop()
  city?: string;

  @prop({
    default: true
  })
  isHome!: boolean;

  @prop()
  times?: number;

  @prop()
  timesDuration?: number;

  @prop()
  preMatchNotes?: string;

  @prop()
  postMatchNotes?: string;

  @prop({
    default: 0
  })
  homeGoals!: number;

  @prop({
    default: 0
  })
  awayGoals!: number;

  @prop({ allowMixed: Severity.ALLOW, default: [] })
  players?: ArraySubDocumentType<Player>;

  @prop({ allowMixed: Severity.ALLOW })
  labels?: ArraySubDocumentType<Label>;

}

/**
 * Get Model from class
 */
const MatchModel = getModelForClass(Match);

/* --------
* Module Exports
* -------- */
export default MatchModel;
