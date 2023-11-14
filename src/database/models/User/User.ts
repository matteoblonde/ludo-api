import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
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
    required: true,
    validate: {
      validator: (psw: string) => {
        return psw.length >= 5;
      },
      message  : 'Password cannot be minus 5 characters'
    }
  })
  public password?: string;

  @prop({
    ref     : () => Company,
    required: true
  })
  public company!: Ref<Company>;

  @prop({
    ref: () => Role
  })
  public role?: Ref<Role>;

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
