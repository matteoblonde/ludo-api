import { buildSchema } from '@typegoose/typegoose';
import { DocumentType } from './DocumentType';


const DocumentTypeSchema = buildSchema(DocumentType);

export default DocumentTypeSchema;
