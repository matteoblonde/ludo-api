import { ArraySubDocumentType, getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { Player } from '../Player/Player';


@modelOptions({ schemaOptions: { collection: 'matches' } })
export class Match {

  @prop()
  userId?: string;

  @prop()
  matchName?: string;

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

  @prop({ allowMixed: Severity.ALLOW })
  players?: ArraySubDocumentType<Player>;

}

/**
 * Get Model from class
 */
const MatchModel = getModelForClass(Match);

/* --------
* Module Exports
* -------- */
export default MatchModel;
