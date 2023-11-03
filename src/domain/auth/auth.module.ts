import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user';
import {
  AuthController,
  GoogleController,
  SteamController,
  TwitchController,
  TwitterController,
} from './controllers';
import { RefreshTokenEntity } from './entities';
import { RefreshTokenRepository } from './repositories';
import { AuthService, CookieService } from './services';
import {
  GoogleStrategy,
  JwtStrategy,
  LocalStrategy,
  RoleGuard,
  SteamStrategy,
  TwitchStrategy,
  TwitterStrategy,
} from './strategies';
import {
  LocalLoginUseCase,
  RefreshTokenUseCase,
  RevokeTokenUseCase,
  SocialLoginUseCase,
} from './usecases';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: 3600 },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    PassportModule,
  ],
  controllers: [
    AuthController,
    GoogleController,
    SteamController,
    TwitterController,
    TwitchController,
  ],
  providers: [
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    SteamStrategy,
    TwitterStrategy,
    TwitchStrategy,
    AuthService,
    CookieService,
    LocalLoginUseCase,
    SocialLoginUseCase,
    RefreshTokenRepository,
    RefreshTokenUseCase,
    RevokeTokenUseCase,
    RoleGuard,
  ],
})
export class AuthModule {}
