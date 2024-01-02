import { buildSchema } from '@typegoose/typegoose';
import { Document } from './Document';


const DocumentSchema = buildSchema(Document);

export default DocumentSchema;
