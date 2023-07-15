import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDto, UserUpdateDto } from '../dtos';
import { UserEntity } from '../entities';
import { AuthTipoEnum } from '../enums';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOne(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  findUserByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  findUserByAuthCredencial(
    authCredencial: string,
    authTipo: AuthTipoEnum,
  ): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        authCredencial: authCredencial,
        authTipo,
      },
    });
  }

  findUserByEmailWithSenha(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'nome', 'sobrenome', 'senha', 'email'],
    });
  }

  async create(data: UserRegisterDto): Promise<UserEntity> {
    const user = await this.userRepository.save(new UserEntity(data));
    delete user.senha;
    return user;
  }

  async update(id: number, data: UserUpdateDto): Promise<UserEntity> {
    const user = await this.findOne(id);
    this.userRepository.merge(user, data);
    await this.userRepository.save({
      id,
      dataAtualizacao: new Date(),
      ...data,
    });
    return await this.findOne(id);
  }

  delete(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.remove(user);
  }
}
