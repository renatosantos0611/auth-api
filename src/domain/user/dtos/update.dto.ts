import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  nome: string;

  @ApiProperty({ example: 'James', required: false })
  @IsOptional()
  @IsString()
  sobrenome: string;

  @ApiProperty({ example: '19912345678', required: false })
  @IsOptional()
  @IsString()
  telefone: string;
}
