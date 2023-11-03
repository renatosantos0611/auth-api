import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitter';
import { ITwitterProfilePayload } from 'src/domain/auth/interfaces';
import { SocialLoginUseCase } from 'src/domain/auth/usecases';
import { AuthTipoEnum } from 'src/domain/user/enums';
import { UserRepository } from 'src/domain/user/repositories';
import { SocialRegisterUseCase } from 'src/domain/user/usecases';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly socialRegisterUseCase: SocialRegisterUseCase,
    private readonly socialLoginUseCase: SocialLoginUseCase,
    configService: ConfigService,
  ) {
    super({
      consumerKey: configService.get('TWITTER_CONSUMER_KEY'),
      consumerSecret: configService.get('TWITTER_CONSUMER_SECRET'),
      callbackURL: 'http://localhost:4000/auth/twitter/callback',
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    token: string,
    tokenSecret: string,
    profile: ITwitterProfilePayload,
  ) {
    const user = await this.userRepository.findUserByAuthCredencial(
      profile.id.toString(),
      AuthTipoEnum.TWITTER,
    );

    if (!user) {
      const newUser = await this.socialRegisterUseCase.execute({
        nome: profile.displayName,
        email: null,
        authCredencial: profile.id.toString(),
        authTipo: AuthTipoEnum.TWITTER,
        iconUrl: profile.photos[0].value.replace('_normal', '_400x400'),
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
