import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { RefreshTokenEntity } from '../entities';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private userRepository: Repository<RefreshTokenEntity>,
  ) {}

  create(data: RefreshTokenEntity): Promise<RefreshTokenEntity> {
    return this.userRepository.save(new RefreshTokenEntity(data));
  }

  findByToken(token: string): Promise<RefreshTokenEntity> {
    return this.userRepository.findOne({
      where: { token, revoked: false },
    });
  }

  async validAccessToken(accessToken: string): Promise<boolean> {
    return !(await this.userRepository.findOne({
      where: { revokedAccessToken: accessToken, revoked: true },
    }));
  }

  revokeToken(id: number, token: string): Promise<UpdateResult> {
    return this.userRepository.update(id, { revoked: true, token });
  }

  updateToken(refreshToken: RefreshTokenEntity): Promise<UpdateResult> {
    return this.userRepository.update(refreshToken.id, {
      ...refreshToken,
      updatedAt: new Date(),
    });
  }
}
