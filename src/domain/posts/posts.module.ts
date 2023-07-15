import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsRepository } from './repositories';
import { PostsEntity } from './entities';
import { PostsController } from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([PostsEntity])],
  controllers: [PostsController],
  providers: [PostsRepository],
})
export class PostsModule {}
