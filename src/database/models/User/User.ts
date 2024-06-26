import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
  SubDocumentType
} from '@typegoose/typegoose';
import { Company } from '../Company/Company';
import { Role } from '../Role/Role';


/* --------
* Schema Definition
* -------- */
@modelOptions({ schemaOptions: { collection: 'users' } })
export class User {

  @prop({
    required: true,
    unique  : true
  })
  public username!: string;

  @prop({})
  public firstName?: string;

  @prop({})
  public lastName?: string;

  @prop({
    default: 'it'
  })
  public language!: string;

  @prop()
  public imgUrl?: string;

  @prop({
    required: true,
    validate: {
      validator: (psw: string) => {
        return psw.length >= 5;
      },
      message  : 'Password cannot be minus 5 characters'
    }
  })
  public password?: string;

  @prop({ required: true, allowMixed: Severity.ALLOW })
  public company!: SubDocumentType<Company>;

  @prop({ required: true, allowMixed: Severity.ALLOW })
  public role!: SubDocumentType<Role>;

  @prop({ required: true, allowMixed: Severity.ALLOW })
  public teams!: string[];

  @prop()
  public currentSeason!: string;

  @prop({
    default: false
  })
  emailVerified?: boolean;

  @prop({
    default: []
  })
  chartsSettings?: any;
}

const UserModel = getModelForClass(User);


/* --------
* Module Exports
* -------- */
export default UserModel;
