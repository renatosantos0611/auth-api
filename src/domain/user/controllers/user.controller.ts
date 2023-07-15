import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/domain/auth/strategies';
import { UserRegisterDto, UserUpdateDto } from '../dtos';
import { UserEntity } from '../entities';
import { UserService } from '../services';
import { LocalRegisterUseCase } from '../usecases';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly registerUseCase: LocalRegisterUseCase,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  register(@Body() data: UserRegisterDto): Promise<UserEntity> {
    return this.registerUseCase.execute(data);
  }

  @Get('')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  findUserBearer(@Req() req: any): Promise<UserEntity> {
    return this.userService.findUserById(req.user.id);
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.findUserById(id);
  }

  @Put(':id')
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UserUpdateDto,
  ): Promise<UserEntity> {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  delete(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.deleteUser(id);
  }
}
