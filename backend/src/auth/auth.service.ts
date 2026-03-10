import {
  Injectable, Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { User } from '../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResultDto, TokenResponseDto } from './dto/auth-response.dto';
import {
  EmailAlreadyExistsException,
  InvalidCredentialsException,
  UserNotFoundException,
} from '../common/exceptions/custom-exceptions';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async register(registerDto: RegisterDto): Promise<AuthResultDto> {
    const { email, password } = registerDto;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await this.userRepository.findOne({
      where: { email: normalizedEmail },
      select: ['id'],
    });

    if (existingUser) {
      this.logger.warn(`Registration attempt with existing email: ${normalizedEmail}`);
      throw new EmailAlreadyExistsException();
    }

    const hashedPassword = await this._hashPassword(password);

    const user = this.userRepository.create({
      email: normalizedEmail,
      passwordHash: hashedPassword,
      tokenVersion: 0,
    });

    await this.userRepository.save(user);
    this.logger.log(`New user registered: ${user.id}`);

    return this._buildAuthResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResultDto> {
    const { email, password } = loginDto;
    const normalizedEmail = email.toLowerCase();

    const user = await this.userRepository.findOne({
      where: { email: normalizedEmail },
      select: ['id', 'email', 'passwordHash', 'tokenVersion'],
    });

    if (!user) {
      this.logger.warn(`Login failed - user not found: ${normalizedEmail}`);
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);

    if (!isPasswordValid) {
      this.logger.warn(`Login failed - invalid password for: ${normalizedEmail}`);
      throw new InvalidCredentialsException();
    }

    this.logger.log(`User logged in: ${user.id}`);
    return this._buildAuthResponse(user);
  }

  async refreshToken(userId: string): Promise<TokenResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'tokenVersion'],
    });

    if (!user) throw new UserNotFoundException();

    return {
      accessToken: this._generateAccessToken(user),
      refreshToken: this._generateRefreshToken(user),
    };
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.update(
      { id: userId },
      { tokenVersion: () => '"token_version" + 1' }
    );

    this.logger.log(`User logged out: ${userId}`);
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'tokenVersion'],
    });
  }

  // ========== PRIVATE METHODS ==========

  private async _hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }

  private _buildAuthResponse(user: User): AuthResultDto {
    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken: this._generateAccessToken(user),
      refreshToken: this._generateRefreshToken(user),
    };
  }

  private _generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
      type: 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '15m'),
    });
  }

  private _generateRefreshToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
      type: 'refresh',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
  }
}