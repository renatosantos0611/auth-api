import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ValidatePayload } from '../interfaces';
import { RefreshTokenRepository } from '../repositories';
import { CookieService } from '../services';
import { RefreshTokenUseCase } from '../usecases';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly cookieService: CookieService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromExtractors([]),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async authenticate(req: Request): Promise<void> {
    const acessToken = req.cookies['accessToken'] as string;
    const refreshToken = req.cookies['refreshToken'] as string;
    const ipAddress = req.ip;

    if (!acessToken && !refreshToken) {
      return this.fail(new UnauthorizedException(), 401);
    }

    try {
      if (!acessToken && refreshToken) {
        const newTokens = await this.refreshTokenUseCase.execute(
          {
            refreshToken,
          },
          ipAddress,
        );

        req.cookies.accessToken = newTokens.accessToken;
        req.cookies.refreshToken = newTokens.refreshToken;
        req.res.cookie(
          'accessToken',
          newTokens.accessToken,
          this.cookieService.getAccessTokenOptions(),
        );
        req.res.cookie(
          'refreshToken',
          newTokens.refreshToken,
          this.cookieService.getRefreshTokenOptions(),
        );
        const jwtPayload = this.jwtService.verify(
          newTokens.accessToken,
          this.configService.get('JWT_SECRET'),
        );

        const payload: ValidatePayload = {
          id: jwtPayload.sub,
          email: jwtPayload.email,
        };

        return this.success(payload);
      }

      if (!(await this.refreshTokenRepository.validAccessToken(acessToken))) {
        return this.fail(new UnauthorizedException(), 401);
      }

      const jwtPayload = this.jwtService.verify(
        acessToken,
        this.configService.get('JWT_SECRET'),
      );

      const payload: ValidatePayload = {
        id: jwtPayload.sub,
        email: jwtPayload.email,
      };

      return this.success(payload);
    } catch (error) {
      return this.fail(new UnauthorizedException(), 401);
    }
  }
}
