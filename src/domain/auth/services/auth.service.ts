import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UserEntity } from 'src/domain/user/entities';
import { UserRepository } from 'src/domain/user/repositories';
import { RefreshTokenEntity } from '../entities';
import { RefreshTokenRepository } from '../repositories';
import { v4 as uuidv4 } from 'uuid';
import { AuthTipoEnum } from 'src/domain/user/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) { }

  async generateJwt(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  generateLocalPayload(userId: number, email: string) {
    return {
      sub: userId,
      email,
    };
  }

  generateSocialPayload(
    userId: number,
    authCredencial: string,
    authTipo: AuthTipoEnum,
  ) {
    return {
      sub: userId,
      authCredencial,
      authTipo,
    };
  }

  async saveAndGenerateLocalRefreshToken(
    payload: any,
    ipAddress: string,
  ): Promise<string> {
    const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);
    const token = uuidv4();
    const refreshToken = await this.refreshTokenRepository.create(
      new RefreshTokenEntity({
        userId: payload.sub,
        email: payload.email,
        createdByIp: ipAddress,
        token,
        expiresAt,
      }),
    );
    return refreshToken.token;
  }

  async saveAndGenerateSocialRefreshToken(
    payload: any,
    ipAddress: string,
  ): Promise<string> {
    const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);
    const token = uuidv4();
    const refreshToken = await this.refreshTokenRepository.create(
      new RefreshTokenEntity({
        userId: payload.sub,
        authCredencial: payload.authCredencial,
        authTipo: payload.authTipo,
        createdByIp: ipAddress,
        token,
        expiresAt,
      }),
    );
    return refreshToken.token;
  }

  async validateUser(email: string, senha: string): Promise<UserEntity> {
    const user = await this.userRepository.findUserByEmailWithSenha(email);
    if (!user) return null;

    const isPasswordValid = compareSync(senha, user.senha);
    delete user.senha;

    if (!isPasswordValid) return null;
    return user;
  }
}
