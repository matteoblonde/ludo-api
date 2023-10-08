import { buildSchema } from '@typegoose/typegoose';
import { Role } from './Role';


const RoleSchema = buildSchema(Role);

export default RoleSchema;
