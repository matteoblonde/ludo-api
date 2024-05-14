import { ArraySubDocumentType, getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { PlayerRole } from '../PlayerRole/PlayerRole';
import { PlayerSubAttribute } from '../PlayerSubAttribute/PlayerSubAttribute';


@modelOptions({ schemaOptions: { collection: 'playerAttributes' } })
export class PlayerAttribute {

  @prop()
  public attributeName?: string;

  @prop()
  public description?: string;

  @prop()
  public order?: number;

  /*  @prop({ allowMixed: Severity.ALLOW })
    public playerRoles?: ArraySubDocumentType<PlayerRole>;
  
    @prop({
      required: true,
      default : true
    })
    public isForAllRoles!: boolean; */

  /*  @prop({
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
    public value!: number;*/

  @prop({
    default: 6
  })
  public value?: number;

  @prop({
    default: false
  })
  public isText?: boolean;

  @prop({
    default: ''
  })
  public textValue?: string;

  @prop({ allowMixed: Severity.ALLOW, default: [] })
  public subAttributes?: ArraySubDocumentType<PlayerSubAttribute>;

}

const PlayerAttributeModel = getModelForClass(PlayerAttribute);

/* --------
* Module Exports
* -------- */
export default PlayerAttributeModel;
