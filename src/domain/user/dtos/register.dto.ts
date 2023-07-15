import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AuthTipoEnum } from '../enums';

export class UserRegisterDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ example: 'James' })
  @IsOptional()
  @IsString()
  sobrenome: string;

  @ApiProperty({ example: '123456' })
  @MaxLength(30)
  @MinLength(6)
  @IsNotEmpty()
  @IsString()
  senha: string;

  @ApiProperty({ example: 'john@john.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '19912345678', required: false })
  @IsOptional()
  @IsString()
  telefone: string;
}

export class UserRegisterExecuteDto extends UserRegisterDto {
  authCredencial?: string;
  iconUrl?: string;
  authTipo?: AuthTipoEnum;
}
