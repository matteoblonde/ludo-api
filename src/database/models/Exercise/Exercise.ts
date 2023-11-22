import {
  ArraySubDocumentType,
  getModelForClass,
  modelOptions,
  prop,
  Severity,
  SubDocumentType
} from '@typegoose/typegoose';
import { ExerciseType } from '../ExerciseType/ExerciseType';
import { Label } from '../Label/Label';


/* --------
* Define the class
* -------- */
@modelOptions({ schemaOptions: { collection: 'exercises' } })
export class Exercise {

  @prop()
  public userId?: string;

  @prop()
  public teams?: string[];

  @prop()
  public exerciseName?: string;

  @prop()
  public exerciseDescription?: string;

  @prop()
  public exerciseTarget?: string;

  @prop()
  public exerciseNotes?: string;

  @prop({ allowMixed: Severity.ALLOW })
  public exerciseType?: SubDocumentType<ExerciseType>;

  @prop({ allowMixed: Severity.ALLOW })
  public labels?: ArraySubDocumentType<Label>;

  @prop()
  public imgUrl?: string;

}

/**
 * Get Model from Class
 */
const ExerciseModel = getModelForClass(Exercise);

/* --------
* Module Exports
* -------- */
export default ExerciseModel;
