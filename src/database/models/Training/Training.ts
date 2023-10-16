import { ArraySubDocumentType, buildSchema, getModelForClass, prop, Severity } from '@typegoose/typegoose';
import DateConverter from '../../setters/date-converter';
import { Exercise } from '../Exercise/Exercise';
import { Label } from '../Label/Label';


/* --------
* Schema Definition
* -------- */
export class Training {

  @prop({ required: true })
  public userId!: string;

  @prop()
  public trainingDescription?: string;

  @prop({
    set: (value: any) => {
      return DateConverter.convertDate(value);
    },
    get: (value: any) => value
  })
  public trainingDate?: Date;

  @prop()
  public trainingNotes?: string;

  // TODO: Add ref to TrainingType in prop decorator
  @prop()
  public trainingType?: string;

  @prop({
    default: function (this: Training) {
      return `Allenamento ${this.trainingDate}`;
    }
  })
  public trainingTitle?: string;

  @prop({allowMixed: Severity.ALLOW})
  public exercise?: ArraySubDocumentType<Exercise>

  @prop({allowMixed: Severity.ALLOW})
  public labels?: ArraySubDocumentType<Label>

}

/**
 * Get Model from Class
 */
const TrainingModel = getModelForClass(Training);

/* --------
* Module Exports
* -------- */
export default TrainingModel;
