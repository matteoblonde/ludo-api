import {
  ArraySubDocumentType,
  getModelForClass,
  modelOptions,
  prop,
  Severity,
  SubDocumentType
} from '@typegoose/typegoose';
import { Company } from '../Company/Company';
import { Role } from '../Role/Role';
import { Team } from '../Team/Team';


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

  @prop({ required: true })
  public teams!: string[];

  @prop({
    default: false
  })
  emailVerified?: boolean;
}

const UserModel = getModelForClass(User);


/* --------
* Module Exports
* -------- */
export default UserModel;
