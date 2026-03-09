import { ApiProperty } from '@nestjs/swagger';

class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;
}

export class AuthResultDto {
  user: UserResponseDto;
  accessToken: string;
  refreshToken: string;
}

export class AuthResponseDto {
  @ApiProperty()
  user: UserResponseDto;
}

export class TokenResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class LogoutResponseDto {
  @ApiProperty()
  message: string;
}