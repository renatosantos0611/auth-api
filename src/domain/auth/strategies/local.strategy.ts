import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntity } from 'src/domain/user/entities';
import { AuthService } from '../services';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'senha',
    });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    const user = await this.authService.validateUser(email, password);
    if (!user)
      throw new UnauthorizedException('Email ou senha estão incorretos');
    return user;
  }
}
