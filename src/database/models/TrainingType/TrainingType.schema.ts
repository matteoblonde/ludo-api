import { buildSchema } from '@typegoose/typegoose';
import { TrainingType } from './TrainingType';


const trainingTypeSchema = buildSchema(TrainingType);

export default trainingTypeSchema;
