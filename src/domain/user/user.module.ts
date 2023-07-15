import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers';
import { UserEntity } from './entities';
import { UserRepository } from './repositories';
import { UserService } from './services';
import { LocalRegisterUseCase, SocialRegisterUseCase } from './usecases';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    LocalRegisterUseCase,
    SocialRegisterUseCase,
  ],
  exports: [
    UserService,
    UserRepository,
    LocalRegisterUseCase,
    SocialRegisterUseCase,
  ],
})
export class UserModule {}
