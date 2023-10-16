import { buildSchema } from '@typegoose/typegoose';
import { Label } from './Label';


const LabelSchema = buildSchema(Label);

export default LabelSchema;
