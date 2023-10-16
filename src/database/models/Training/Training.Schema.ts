import { buildSchema } from '@typegoose/typegoose';
import { Training } from './Training';


const TrainingSchema = buildSchema(Training)

export default TrainingSchema;
