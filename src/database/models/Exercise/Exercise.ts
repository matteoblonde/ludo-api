import { ArraySubDocumentType, getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { Label } from '../Label/Label';


/* --------
* Define the class
* -------- */
@modelOptions({ schemaOptions: { collection: 'exercises' }})
export class Exercise {

  @prop()
  public exerciseName?: string;

  @prop()
  public exerciseDescription?: string;

  @prop()
  public exerciseTarget?: string;

  @prop()
  public exerciseNotes?: string;

  // TODO: add ref to exercise types collection in prop decorator
  @prop()
  public exerciseTypeName?: string;

  @prop({ required: true })
  public userId!: string;

  @prop({allowMixed: Severity.ALLOW})
  public labels?: ArraySubDocumentType<Label>

}

/**
 * Get Model from Class
 */
const ExerciseModel = getModelForClass(Exercise);

/* --------
* Module Exports
* -------- */
export default ExerciseModel;
