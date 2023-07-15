import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthTipoEnum } from 'src/domain/user/enums';
import { RefreshTokenDto } from '../dtos';
import { RefreshTokenRepository } from '../repositories';
import { AuthService } from '../services';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(data: RefreshTokenDto, ipAddress: string): Promise<any> {
    const refreshToken = await this.refreshTokenRepository.findByToken(
      data.refreshToken,
    );

    if (!refreshToken) {
      throw new BadRequestException('Refresh token invalido');
    }

    if (refreshToken.expiresAt < new Date()) {
      throw new BadRequestException('Refresh token expirado');
    }

    let payload: any = {};
    let newRefreshToken: string = '';
    if (refreshToken.authTipo === AuthTipoEnum.LOCAL) {
      payload = this.authService.generateLocalPayload(
        refreshToken.userId,
        refreshToken.email,
      );

      newRefreshToken = await this.authService.saveAndGenerateLocalRefreshToken(
        payload,
        ipAddress,
      );
    }

    if (refreshToken.authTipo !== AuthTipoEnum.LOCAL) {
      payload = this.authService.generateSocialPayload(
        refreshToken.userId,
        refreshToken.authCredencial,
        refreshToken.authTipo,
      );
      newRefreshToken =
        await this.authService.saveAndGenerateSocialRefreshToken(
          payload,
          ipAddress,
        );
    }

    refreshToken.revoked = true;
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken;
    await this.refreshTokenRepository.updateToken(refreshToken);

    return {
      accessToken: await this.authService.generateJwt(payload),
      refreshToken: newRefreshToken,
    };
  }
}
