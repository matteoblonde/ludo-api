import slugify from 'slugify';
import { DocumentType, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';


/* --------
* Schema Definition
* -------- */
@modelOptions({ schemaOptions: { collection: 'companies' } })
export class Company {

  @prop({
    required: true
  })
  public companyName!: string;

  @prop({
    required: true,
    unique  : true,
    default : (function (this: DocumentType<Company>) {
      return slugify(this.companyName, { lower: true });
    })
  })
  companyNameSlugify!: string;

  @prop()
  public imgUrl?: string;

  @prop()
  public currentSeason!: string;

  @prop()
  public sport?: string;

}

const CompanyModel = getModelForClass(Company);

/* --------
* Module Exports
* -------- */
export default CompanyModel;
