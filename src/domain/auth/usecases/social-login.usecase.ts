import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/domain/user/entities';
import { AuthService } from '../services/auth.service';

@Injectable()
export class SocialLoginUseCase {
  constructor(private readonly authService: AuthService) {}

  public async execute(user: UserEntity, ipAddress: string): Promise<any> {
    const payload = this.authService.generateSocialPayload(
      user.id,
      user.authCredencial,
      user.authTipo,
    );

    const newRefreshToken =
      await this.authService.saveAndGenerateSocialRefreshToken(
        payload,
        ipAddress,
      );

    return {
      ...user,
      accessToken: await this.authService.generateJwt(payload),
      refreshToken: newRefreshToken,
    };
  }
}
