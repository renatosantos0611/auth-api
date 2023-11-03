import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 'Um codigo gigante', required: false })
  @IsString()
  @IsOptional()
  refreshToken: string;
}
