import { buildSchema } from '@typegoose/typegoose';
import { PlayerStat } from './PlayerStat';


const playerStatSchema = buildSchema(PlayerStat);

export default playerStatSchema;
