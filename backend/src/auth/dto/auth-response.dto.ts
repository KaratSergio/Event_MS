import { ApiProperty } from '@nestjs/swagger';

class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;
}

export class AuthResponseDto {
  @ApiProperty()
  user: UserResponseDto;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class TokenResponseDto {
  @ApiProperty()
  accessToken: string;
}

export class LogoutResponseDto {
  @ApiProperty()
  message: string;
}