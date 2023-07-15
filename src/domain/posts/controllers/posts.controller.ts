import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PostsRepository } from '../repositories';
import { CreatePostsDto } from '../dtos';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsRepository: PostsRepository) {}

  @Post()
  createPost(@Body() data: CreatePostsDto) {
    return this.postsRepository.createPost(data);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsRepository.findOne(id);
  }
}
