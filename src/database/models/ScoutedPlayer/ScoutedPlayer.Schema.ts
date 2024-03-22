import { buildSchema } from '@typegoose/typegoose';
import { ScoutedPlayer } from './ScoutedPlayer';


const ScoutedPlayerSchema = buildSchema(ScoutedPlayer);

export default ScoutedPlayerSchema;
