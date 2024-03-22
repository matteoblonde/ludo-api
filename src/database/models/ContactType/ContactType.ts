/* --------
* Define the class
* -------- */
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';


@modelOptions({ schemaOptions: { collection: 'contactTypes' } })
export class ContactType {

  @prop()
  public typeName?: string;

  @prop()
  public order?: number;

}

/**
 * Get Model from Class
 */
const ContactTypeModel = getModelForClass(ContactType);

/* --------
* Module Exports
* -------- */
export default ContactTypeModel;

