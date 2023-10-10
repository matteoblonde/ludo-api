import { buildSchema } from '@typegoose/typegoose';
import { Player } from './Player';


const PlayerSchema = buildSchema(Player);

export default PlayerSchema;
