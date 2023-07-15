import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from 'src/domain/user/repositories';
import { SocialRegisterUseCase } from 'src/domain/user/usecases';
import { SocialLoginUseCase } from '../usecases';
import { ISteamProfilePayload } from '../interfaces';
import { AuthTipoEnum } from 'src/domain/user/enums';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly socialRegisterUseCase: SocialRegisterUseCase,
    private readonly socialLoginUseCase: SocialLoginUseCase,
    configService: ConfigService,
  ) {
    super({
      returnURL: 'http://localhost:4000/auth/steam/return',
      realm: 'http://localhost:4000/',
      apiKey: configService.get('STEAM_API_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, identifier: string, profile: ISteamProfilePayload) {
    const user = await this.userRepository.findUserByAuthCredencial(
      profile.id,
      AuthTipoEnum.STEAM,
    );

    if (!user) {
      const newUser = await this.socialRegisterUseCase.execute({
        nome: profile.displayName,
        email: null,
        authCredencial: profile.id,
        authTipo: AuthTipoEnum.STEAM,
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
