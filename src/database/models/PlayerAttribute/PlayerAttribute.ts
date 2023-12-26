import { ArraySubDocumentType, getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { PlayerRole } from '../PlayerRole/PlayerRole';


@modelOptions({ schemaOptions: { collection: 'playerAttributes' } })
export class PlayerAttribute {

  @prop()
  public attributeName?: string;

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

const PlayerAttributeModel = getModelForClass(PlayerAttribute);

/* --------
* Module Exports
* -------- */
export default PlayerAttributeModel;
