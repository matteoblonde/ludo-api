import { buildSchema } from '@typegoose/typegoose';
import { TrainingAbsence } from './TrainingAbsence';


const TrainingAbsenceSchema = buildSchema(TrainingAbsence);

export default TrainingAbsenceSchema;
