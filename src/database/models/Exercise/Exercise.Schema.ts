import { buildSchema } from '@typegoose/typegoose';
import { Exercise } from './Exercise';


const ExerciseSchema = buildSchema(Exercise);

export default ExerciseSchema;
