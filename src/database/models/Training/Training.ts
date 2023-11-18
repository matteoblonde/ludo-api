import {
  ArraySubDocumentType,
  getModelForClass,
  modelOptions,
  prop,
  Severity,
  SubDocumentType
} from '@typegoose/typegoose';
import { Exercise } from '../Exercise/Exercise';
import { Label } from '../Label/Label';
import { TrainingType } from '../TrainingType/TrainingType';


/* --------
* Schema Definition
* -------- */
@modelOptions({ schemaOptions: { collection: 'trainings' } })
export class Training {

  @prop()
  public userId?: string;

  @prop()
  public trainingDescription?: string;

  @prop({
    required: true,
    default : new Date()
  })
  public trainingDate!: Date;

  @prop()
  public trainingNotes?: string;

  @prop({ allowMixed: Severity.ALLOW })
  public trainingType?: SubDocumentType<TrainingType>;

  @prop({
    default: function (this: Training) {
      const dateString = new Date(this.trainingDate).toDateString();
      return `Training ${dateString}`;
    }
  })
  public trainingTitle?: string;

  @prop({ allowMixed: Severity.ALLOW })
  public exercises?: ArraySubDocumentType<Exercise>;

  @prop({ allowMixed: Severity.ALLOW })
  public labels?: ArraySubDocumentType<Label>;

}

/**
 * Get Model from Class
 */
const TrainingModel = getModelForClass(Training);

/* --------
* Module Exports
* -------- */
export default TrainingModel;
