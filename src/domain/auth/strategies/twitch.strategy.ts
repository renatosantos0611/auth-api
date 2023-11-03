import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitch-new';
import { AuthTipoEnum } from 'src/domain/user/enums';
import { UserRepository } from 'src/domain/user/repositories';
import { SocialRegisterUseCase } from 'src/domain/user/usecases';
import { v4 as uuidv4 } from 'uuid';
import { ITwitchProfilePayload } from '../interfaces';
import { SocialLoginUseCase } from '../usecases';

@Injectable()
export class TwitchStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly socialRegisterUseCase: SocialRegisterUseCase,
    private readonly socialLoginUseCase: SocialLoginUseCase,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get('TWITCH_CLIENT_ID'),
      clientSecret: configService.get('TWITCH_CLIENT_SECRET'),
      callbackURL: 'http://localhost:4000/auth/twitch/callback',
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    token: string,
    tokenSecret: string,
    profile: ITwitchProfilePayload,
  ) {
    const user = await this.userRepository.findUserByAuthCredencial(
      profile.id,
      AuthTipoEnum.TWITCH,
    );

    if (!user) {
      const newUser = await this.socialRegisterUseCase.execute({
        nome: profile.display_name,
        email: null,
        authCredencial: profile.id,
        authTipo: AuthTipoEnum.TWITCH,
        iconUrl: profile.profile_image_url,
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
