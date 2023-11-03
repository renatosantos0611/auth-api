import { BadRequestException, Injectable } from '@nestjs/common';
import { UserUpdateDto } from '../dtos';
import { UserEntity } from '../entities';
import { AuthTipoEnum } from '../enums';
import { UserRepository } from '../repositories';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async ValidEmailToRegister(email: string): Promise<boolean> {
    const emailUser = await this.userRepository.findUserByEmail(email);
    if (emailUser) throw new BadRequestException('Email já existe');

    return true;
  }

  async ValidCredentialToRegister(
    authCredential: string,
    authType: AuthTipoEnum,
  ): Promise<boolean> {
    const emailUser = await this.userRepository.findUserByAuthCredencial(
      authCredential,
      authType,
    );
    if (emailUser) throw new BadRequestException('Credencial já existe');

    return true;
  }

  async checkUserExistsByIdAndReturnUser(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new BadRequestException('Usuário não existe');
    return user;
  }

  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new BadRequestException('Usuário não existe');
    return user;
  }

  async updateUser(id: number, data: UserUpdateDto): Promise<UserEntity> {
    await this.checkUserExistsByIdAndReturnUser(id);
    return this.userRepository.update(id, data);
  }

  async deleteUser(id: number): Promise<UserEntity> {
    const user = await this.checkUserExistsByIdAndReturnUser(id);
    return await this.userRepository.delete(user);
  }
}
