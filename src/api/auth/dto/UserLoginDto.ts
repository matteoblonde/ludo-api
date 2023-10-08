import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';


export class UserLoginDto {

  @ApiProperty({
    type       : String,
    description: 'Username'
  })
  @IsDefined()
  username!: string;

  @ApiProperty({
    type       : String,
    description: 'User Password'
  })
  @IsDefined()
  @IsString()
  password!: string;

}
