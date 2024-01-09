import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';


@modelOptions({ schemaOptions: { collection: 'trainingAbsences' } })
export class TrainingAbsence {

  @prop()
  public trainingId!: string;

  @prop()
  public playerId!: string;

  @prop()
  public reason?: string;

  @prop()
  public date?: Date;

}

/**
 * Get Model from Class
 */
const TrainingAbsenceModel = getModelForClass(TrainingAbsence);

/* --------
* Module Exports
* -------- */
export default TrainingAbsenceModel;
