export type TUserType = 'user';

export interface IUserData {
  username: string;

  company: string;

  userId: string;

  teams: string[];

  currentSeason?: string;

  roleLevel: number;
}
