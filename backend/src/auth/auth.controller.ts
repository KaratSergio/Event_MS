import {
  Controller,
  Res, Post, Body, Get,
  HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation,
  ApiResponse, ApiBearerAuth
} from '@nestjs/swagger';
import {
  RegisterDto, LoginDto,
  AuthResponseDto,
} from './dto';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard, RefreshGuard, GetUser } from '../common';
import { User } from '../database/entities';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered successfully', type: AuthResponseDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already exists' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(registerDto);
    this._setTokenCookies(res, result.accessToken, result.refreshToken);
    return { user: result.user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful', type: AuthResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);
    this._setTokenCookies(res, result.accessToken, result.refreshToken);
    return { user: result.user };
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Token refreshed' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Invalid refresh token' })
  async refreshToken(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshToken(user.id);
    this._setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    return { message: 'Token refreshed successfully' };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'Logged out successfully' })
  async logout(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!user) return { message: 'Already logged out' };
    await this.authService.logout(user.id);
    this._clearTokenCookies(res);
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: 'Current user profile' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getMe(@GetUser() user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }

  private readonly cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax' as const,
  };

  private _setTokenCookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie('accessToken', accessToken, {
      ...this.cookieOptions,
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      ...this.cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });
  }

  private _clearTokenCookies(res: Response): void {
    res.clearCookie('accessToken', {
      ...this.cookieOptions,
      path: '/',
    });

    res.clearCookie('refreshToken', {
      ...this.cookieOptions,
      path: '/auth/refresh',
    });
  }
}