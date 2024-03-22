import { buildSchema } from '@typegoose/typegoose';
import { PlayerSubAttribute } from './PlayerSubAttribute';


const PlayerSubAttributeSchema = buildSchema(PlayerSubAttribute);

export default PlayerSubAttributeSchema;
