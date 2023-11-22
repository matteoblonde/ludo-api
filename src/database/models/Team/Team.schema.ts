import { buildSchema } from '@typegoose/typegoose';
import { Team } from './Team';


const TeamSchema = buildSchema(Team);

export default TeamSchema;
