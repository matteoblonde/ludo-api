import { buildSchema } from '@typegoose/typegoose';
import { User } from './User';


const UserSchema = buildSchema(User);

export default UserSchema;
