import { buildSchema } from '@typegoose/typegoose';
import { PlayerAttribute } from './PlayerAttribute';


const PlayerAttributeSchema = buildSchema(PlayerAttribute);

export default PlayerAttributeSchema;
