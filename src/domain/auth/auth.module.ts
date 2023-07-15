import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user';
import { AuthController } from './controllers';
import { RefreshTokenEntity } from './entities';
import { RefreshTokenRepository } from './repositories';
import { AuthService, CookieService } from './services';
import {
  RoleGuard,
  JwtStrategy,
  LocalStrategy,
  GoogleStrategy,
  SteamStrategy,
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
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    SteamStrategy,
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
