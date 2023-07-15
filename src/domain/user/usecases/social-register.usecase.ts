import { Injectable } from '@nestjs/common';
import { UserRegisterExecuteDto } from '../dtos';
import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';
import { UserService } from '../services';

@Injectable()
export class SocialRegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  async execute(data: UserRegisterExecuteDto): Promise<UserEntity> {
    await this.userService.ValidCredentialToRegister(
      data.authCredencial,
      data.authTipo,
    );
    return this.userRepository.create(data);
  }
}
