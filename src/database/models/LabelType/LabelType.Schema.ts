import { buildSchema } from '@typegoose/typegoose';
import { LabelType } from './LabelType';


const LabelTypeSchema = buildSchema(LabelType);

export default LabelTypeSchema;
