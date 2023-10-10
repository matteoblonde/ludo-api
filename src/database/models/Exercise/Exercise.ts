import * as uuid from 'uuid';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';


/* --------
* Schema Definition
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

}

const ExerciseModel = getModelForClass(Exercise);

/* --------
* Module Exports
* -------- */
export default ExerciseModel;
