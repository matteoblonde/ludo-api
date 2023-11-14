import { buildSchema } from '@typegoose/typegoose';
import { ExerciseType } from './ExerciseType';


const exerciseTypeSchema = buildSchema(ExerciseType);

export default exerciseTypeSchema;
