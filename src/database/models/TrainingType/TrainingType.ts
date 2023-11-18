import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';


@modelOptions({ schemaOptions: { collection: 'trainingTypes' } })
export class TrainingType {

  @prop()
  public order?: number;

  @prop()
  public trainingTypeName?: string;

  @prop()
  public trainingTypeNotes?: string;

}

const TrainingTypeModel = getModelForClass(TrainingType);

/* --------
* Module Exports
* -------- */
export default TrainingTypeModel;
