import { getModelForClass, modelOptions, prop, Severity, SubDocumentType } from '@typegoose/typegoose';
import { DocumentType } from '../DocumentType/DocumentType';


@modelOptions({ schemaOptions: { collection: 'documents' } })
export class Document {

  @prop({ allowMixed: Severity.ALLOW })
  public type?: SubDocumentType<DocumentType>;

  @prop()
  public number?: string;

  @prop()
  public releasePlace?: string;

  @prop()
  public releaseDate?: Date;

  @prop()
  public expiringDate?: Date;

}

const DocumentModel = getModelForClass(Document);

/* --------
* Module Exports
* -------- */
export default DocumentModel;
