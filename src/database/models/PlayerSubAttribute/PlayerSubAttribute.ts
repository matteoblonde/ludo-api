import { ArraySubDocumentType, getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { PlayerRole } from '../PlayerRole/PlayerRole';


@modelOptions({ schemaOptions: { collection: 'playerSubAttributes' } })
export class PlayerSubAttribute {

  //TODO: Ref to attributes
  @prop()
  public attributeId?: string;

  @prop()
  public subAttributeName?: string;

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
    default: false
  })
  public isRequired!: boolean;

  @prop({
    required: true,
    default : 0
  })
  public minValue!: number;

  @prop({
    required: true,
    default : 10
  })
  public maxValue!: number;

  @prop({
    required: true,
    default : 6
  })
  public value!: number;

  @prop({
    default: false
  })
  public isText!: boolean;

  @prop()
  public textValue?: string;

  @prop({
    default: true
  })
  public countForGlobalValue!: boolean;

}

const PlayerSubAttributeModel = getModelForClass(PlayerSubAttribute);

/* --------
* Module Exports
* -------- */
export default PlayerSubAttributeModel;
