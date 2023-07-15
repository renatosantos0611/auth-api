import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/domain/user/entities';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalLoginUseCase {
  constructor(private readonly authService: AuthService) {}

  public async execute(user: UserEntity, ipAddress: string): Promise<any> {
    const payload = this.authService.generateLocalPayload(user.id, user.email);

    const newRefreshToken =
      await this.authService.saveAndGenerateLocalRefreshToken(
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
