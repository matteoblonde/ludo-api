import { buildSchema } from '@typegoose/typegoose';
import { Match } from './Match';


const MatchSchema = buildSchema(Match);

export default MatchSchema;
