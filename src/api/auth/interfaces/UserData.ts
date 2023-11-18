import { Ref } from '@typegoose/typegoose';
import { Company } from '../../../database/models/Company/Company';
import { Role } from '../../../database/models/Role/Role';


export type TUserType = 'user';

export interface IUserData {
  username: string;

  company: string;

  userId: string;

  roleLevel: number;
}
