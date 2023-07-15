import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostsDto } from '../dtos';
import { PostsEntity } from '../entities';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(PostsEntity)
    private postsRepository: Repository<PostsEntity>,
  ) {}

  async createPost(data: CreatePostsDto) {
    return this.postsRepository.save(new PostsEntity(data));
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return post;
  }
}
