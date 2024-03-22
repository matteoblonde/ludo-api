/* --------
* Define the class
* -------- */
import { DocumentType, getModelForClass, prop, Severity } from '@typegoose/typegoose';
import { Residence } from '../../interfaces';
import { ContactType } from '../ContactType/ContactType';
import documentType from '../DocumentType/DocumentType';


export class Contact {

  @prop()
  public firstName?: string;

  @prop()
  public lastName?: string;

  @prop({ allowMixed: Severity.ALLOW })
  public contactType?: DocumentType<ContactType>;

  @prop()
  public notes?: string;

  @prop()
  public mobilePhoneNumber?: number;

  @prop()
  public telephoneNumber?: number;

  @prop()
  public email?: string;

  @prop({
    default   : {
      address   : '',
      city      : '',
      postalCode: '',
      country   : ''
    },
    allowMixed: Severity.ALLOW
  })
  public residence?: DocumentType<Residence>;
}

/**
 * Get Model from Class
 */
const ContactModel = getModelForClass(Contact);

/* --------
* Module Exports
* -------- */
export default ContactModel;
