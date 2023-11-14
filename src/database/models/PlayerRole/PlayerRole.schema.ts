import { buildSchema } from '@typegoose/typegoose';
import { PlayerRole } from './PlayerRole';


const playerRoleSchema = buildSchema(PlayerRole);

export default playerRoleSchema;
