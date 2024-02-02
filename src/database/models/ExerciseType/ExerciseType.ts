import { ArraySubDocumentType, getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { Target } from '../Target/Target';


@modelOptions({ schemaOptions: { collection: 'exerciseTypes' } })
export class ExerciseType {

  @prop()
  public order?: number;

  @prop()
  public exerciseTypeName?: string;

  @prop()
  public exerciseTypeNotes?: string;

  @prop({ allowMixed: Severity.ALLOW })
  public targets?: ArraySubDocumentType<Target>;

}

const ExerciseTypeModel = getModelForClass(ExerciseType);

/* --------
* Module Exports
* -------- */
export default ExerciseTypeModel;
