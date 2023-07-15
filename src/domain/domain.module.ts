import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { PostsModule } from './posts';
import { UserModule } from './user';

@Module({
  imports: [AuthModule, UserModule, PostsModule],
})
export class DomainModule {}
