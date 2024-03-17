import {
  ArraySubDocumentType,
  getModelForClass,
  modelOptions,
  prop, Ref,
  Severity,
  SubDocumentType
} from '@typegoose/typegoose';
import { roundDateToNearestQuarter } from '../../../utils/date/date-converter';
import { Label } from '../Label/Label';
import { Player } from '../Player/Player';
import { Team } from '../Team/Team';


@modelOptions({ schemaOptions: { collection: 'matches' } })
export class Match {

  @prop()
  userId?: string;

  @prop({ allowMixed: Severity.ALLOW })
  public teams?: string[];

  @prop()
  public season?: string;

  @prop()
  matchName?: string;

  @prop({ allowMixed: Severity.ALLOW })
  team?: SubDocumentType<Team>;

  @prop()
  opposingTeamName?: string;

  @prop({
    default: roundDateToNearestQuarter(() => new Date())
  })
  matchDateTime?: Date;

  @prop({
    default: roundDateToNearestQuarter(() => new Date())
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

  /*  @prop({ allowMixed: Severity.ALLOW, default: [] })
    players?: ArraySubDocumentType<Player>;*/

  // @ts-ignore
  @prop({ ref: () => Player })
  public players?: Ref<Player>[];

  /*  @prop({ ref: () => Player })
    public players?: Ref<Player[]>;

    @prop({
      ref         : () => Player,
      foreignField: '_id',
      localField  : 'players',
      justOne     : false
    })
    public playerDetails?: Ref<Player[]>;*/

  @prop({ allowMixed: Severity.ALLOW })
  labels?: ArraySubDocumentType<Label>;

  @prop()
  teamListStaff?: object;

  @prop()
  adbReport?: object;


}


/**
 * Get Model from class
 */
const MatchModel = getModelForClass(
  Match,
  { schemaOptions: { toJSON: { virtuals: true }, toObject: { virtuals: true } } }
);

/*MatchModel.schema.pre('find', async function () {
  this.populate('players');
});*/

/* --------
* Module Exports
* -------- */
export default MatchModel;
