import { buildSchema } from '@typegoose/typegoose';
import { MaybeUser } from './MaybeUser';


const MaybeUserSchema = buildSchema(MaybeUser);

export default MaybeUserSchema;
