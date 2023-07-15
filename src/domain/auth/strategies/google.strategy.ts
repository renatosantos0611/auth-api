import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthTipoEnum } from 'src/domain/user/enums';
import { UserRepository } from 'src/domain/user/repositories';
import { SocialRegisterUseCase } from 'src/domain/user/usecases';
import { v4 as uuidv4 } from 'uuid';
import { SocialLoginUseCase } from '../usecases';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly socialRegisterUseCase: SocialRegisterUseCase,
    private readonly socialLoginUseCase: SocialLoginUseCase,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:4000/auth/google/callback',
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    const user = await this.userRepository.findUserByAuthCredencial(
      profile.emails[0].value,
      AuthTipoEnum.GOOGLE,
    );

    if (!user) {
      const newUser = await this.socialRegisterUseCase.execute({
        nome: profile.displayName,
        email: null,
        authCredencial: profile.emails[0].value,
        authTipo: AuthTipoEnum.GOOGLE,
        iconUrl: profile.photos[0].value || null,
        senha: uuidv4(),
        sobrenome: null,
        telefone: null,
      });

      const authenticatedUser = await this.socialLoginUseCase.execute(
        newUser,
        req?.ip,
      );

      return authenticatedUser;
    }

    const authenticatedUser = await this.socialLoginUseCase.execute(
      user,
      req?.ip,
    );
    return authenticatedUser;
  }
}
