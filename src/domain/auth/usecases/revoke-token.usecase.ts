import { BadRequestException, Injectable } from '@nestjs/common';
import { IRevokeToken } from '../interfaces';
import { RefreshTokenRepository } from '../repositories';

@Injectable()
export class RevokeTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(data: IRevokeToken, ipAddress: string): Promise<any> {
    const refreshToken = await this.refreshTokenRepository.findByToken(
      data.refreshToken,
    );

    if (!refreshToken) {
      throw new BadRequestException('Refresh token invalido');
    }

    if (refreshToken.expiresAt < new Date()) {
      throw new BadRequestException('Refresh token expirado');
    }

    refreshToken.revoked = true;
    refreshToken.revokedByIp = ipAddress;
    refreshToken.revokedAccessToken = data.accessToken;
    await this.refreshTokenRepository.updateToken(refreshToken);

    return {
      message: 'Refresh token revoked',
    };
  }
}
