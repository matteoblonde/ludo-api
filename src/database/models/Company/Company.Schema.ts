import { buildSchema } from '@typegoose/typegoose';
import { Company } from './Company';


const CompanySchema = buildSchema(Company);

export default CompanySchema;
