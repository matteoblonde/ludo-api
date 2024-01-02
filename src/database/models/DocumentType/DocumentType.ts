import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';


@modelOptions({ schemaOptions: { collection: 'documentTypes' } })
export class DocumentType {

  @prop()
  public typeName?: string;

  @prop({
    default: false
  })
  public isForTeamList?: boolean;

  @prop()
  teamListOrder?: number;

}

const DocumentTypeModel = getModelForClass(DocumentType);

/* --------
* Module Exports
* -------- */
export default DocumentTypeModel;
