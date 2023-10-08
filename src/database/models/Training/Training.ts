import * as uuid from 'uuid';
import DateConverter from '../../setters/date-converter';
import { buildSchema, getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Exercise } from '../Exercise/Exercise';


/* --------
* Schema Definition
* -------- */
class Training {

  @prop()
  public description?: string;

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
    ref: () => Exercise
  })
  public trainingExercises?: Ref<Exercise>[];

  @prop({
    default: function (this: Training) {
      return `Allenamento ${this.trainingDate}`;
    }
  })
  public trainingTitle?: string;

}

const TrainingSchema = buildSchema(Training);
export { TrainingSchema };

const TrainingModel = getModelForClass(Training);

/* --------
* Module Exports
* -------- */
export default TrainingModel;
