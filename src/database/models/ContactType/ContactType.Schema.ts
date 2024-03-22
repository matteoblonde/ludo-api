import { buildSchema } from '@typegoose/typegoose';
import { ContactType } from './ContactType';


const ContactTypeSchema = buildSchema(ContactType);

export default ContactTypeSchema;
