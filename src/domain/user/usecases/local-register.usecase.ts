import { Injectable } from '@nestjs/common';
import { UserRegisterDto, UserRegisterExecuteDto } from '../dtos';
import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';
import { UserService } from '../services';

@Injectable()
export class LocalRegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  async execute(data: UserRegisterDto): Promise<UserEntity> {
    await this.userService.ValidEmailToRegister(data.email);
    return this.userRepository.create(data);
  }
}
