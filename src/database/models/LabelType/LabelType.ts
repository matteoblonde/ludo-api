import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';


/**
 * Define Enum
 */
enum LabelValueType {
  STRING = 'string',
  NUMBER = 'number'
}

/**
 * Custom class SubDocument
 */

// TODO: Create collection Sections and ref here

@modelOptions({schemaOptions: {collection: 'labelTypes'}})
export class LabelType {

  @prop({ required: true })
  public userId!: string;

  @prop()
  labelTypeName?: string;

  @prop({enum: LabelValueType, default: LabelValueType.STRING, required: true})
  labelValueType!: LabelValueType;

  @prop({allowMixed: Severity.ALLOW})
  labelTypeValuesList?: string[] | number[]

  @prop({
    required: true,
    default: false
  })
  required!: boolean;

  //TODO: Create interface or enum section, to set always the same value
  @prop({
    allowMixed: Severity.ALLOW,
    required: true,
    default: ['exercises', 'trainings', 'matches', 'players'],
  })
  sections!: string[]

  @prop({
    required: true,
    default: true
  })
  isFreeText!: boolean;

  @prop({
    required: true,
    default: false
  })
  isValueList!: boolean;

}

const LabelTypeModel = getModelForClass(LabelType);

/* --------
* Module Exports
* -------- */
export default LabelTypeModel;
