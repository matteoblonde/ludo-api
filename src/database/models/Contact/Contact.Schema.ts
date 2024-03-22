import { buildSchema } from '@typegoose/typegoose';
import { Contact } from './Contact';


const ContactSchema = buildSchema(Contact);

export default ContactSchema;
