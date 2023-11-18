import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';


@modelOptions({ schemaOptions: { collection: 'exerciseTypes' } })
export class ExerciseType {

  @prop()
  public order?: number;

  @prop()
  public exerciseTypeName?: string;

  @prop()
  public exerciseTypeNotes?: string;

}

const ExerciseTypeModel = getModelForClass(ExerciseType);

/* --------
* Module Exports
* -------- */
export default ExerciseTypeModel;
