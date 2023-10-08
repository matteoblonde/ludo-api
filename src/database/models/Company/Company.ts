import * as uuid from 'uuid';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';


/* --------
* Schema Definition
* -------- */
@modelOptions({ schemaOptions: { collection: 'companies' }, options: { customName: 'companies' } })
export class Company {

  @prop({ required: true })
  public _id!: string;

  @prop()
  public companyName?: string;

}

const CompanyModel = getModelForClass(Company);

/* --------
* Module Exports
* -------- */
export default CompanyModel;
