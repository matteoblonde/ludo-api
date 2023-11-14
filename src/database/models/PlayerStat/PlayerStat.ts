import { ArraySubDocumentType, getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { PlayerRole } from '../PlayerRole/PlayerRole';


@modelOptions({ schemaOptions: { collection: 'playerStats' } })
export class PlayerStat {

  @prop({ required: true })
  public userId!: string;

  @prop()
  public statName?: string;

  @prop()
  public description?: string;

  @prop()
  public order?: number;

  @prop({ allowMixed: Severity.ALLOW })
  public playerRoles?: ArraySubDocumentType<PlayerRole>;

  @prop({
    required: true,
    default : true
  })
  public isForAllRoles!: boolean;

  @prop({
    required: true,
    default : 0
  })
  public minValue!: number;

  @prop({
    required: true,
    default : 100
  })
  public maxValue!: number;

  @prop({
    required: true,
    default : 60
  })
  public value!: number;

}

const PlayerStatModel = getModelForClass(PlayerStat);

/* --------
* Module Exports
* -------- */
export default PlayerStatModel;
