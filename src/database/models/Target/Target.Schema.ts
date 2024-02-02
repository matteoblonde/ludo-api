import { buildSchema } from '@typegoose/typegoose';
import { Target } from './Target';


const TargetSchema = buildSchema(Target);

export default TargetSchema;
