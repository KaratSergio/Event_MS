import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) { }

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies['accessToken'];
      if (token) {
        const payload = this.jwtService.verify(token);
        if (payload.exp * 1000 > Date.now()) {
          req.user = { id: payload.sub, email: payload.email };
        }
      }
    } catch (e) {
      // Ignore
    }
    next();
  }
}