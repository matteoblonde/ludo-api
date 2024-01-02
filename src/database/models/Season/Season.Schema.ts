import { buildSchema } from '@typegoose/typegoose';
import { Season } from './Season';


const SeasonSchema = buildSchema(Season);

export default SeasonSchema;
