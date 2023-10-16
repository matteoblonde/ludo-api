import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';


@modelOptions({schemaOptions: {collection: 'labels'}})
export class Label {

  @prop({
    required: true,
    default: 'New Label'
  })
  labelName!: string;

  @prop({allowMixed: Severity.ALLOW})
  labelValue?: string | number;

  @prop({
    required: true,
    default: 'string'
  })
  labelValueType!: string;

  @prop({allowMixed: Severity.ALLOW})
  labelPossibleValues?: string[] | number[];

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

const LabelModel = getModelForClass(Label);

/* --------
* Module Exports
* -------- */
export default LabelModel;
