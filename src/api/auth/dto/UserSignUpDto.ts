import { IsDefined } from 'class-validator';
import { Match } from '../decorators';
import { UserLoginDto } from './UserLoginDto';


export class UserSignUpDto extends UserLoginDto {

  @Match('password', { message: 'Password doesn\'t match' })
  passwordConfirm!: string;

  @IsDefined()
  companyName!: string;

}
