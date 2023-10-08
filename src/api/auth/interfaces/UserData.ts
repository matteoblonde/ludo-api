import { Ref } from '@typegoose/typegoose';
import { Company } from '../../../database/models/Company/Company';
import { Role } from '../../../database/models/Role/Role';


export type TUserType = 'user';

export interface IUserData {
  username: string;

  company: Ref<Company> | undefined;

  userId: string;

  role: Ref<Role> | undefined;
}
