import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
