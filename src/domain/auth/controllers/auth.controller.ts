import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginDto, RefreshTokenDto } from '../dtos';
import { CookieService } from '../services';
import {
  LocalLoginUseCase,
  RefreshTokenUseCase,
  RevokeTokenUseCase,
} from '../usecases';

@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LocalLoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly revokeTokenUseCase: RevokeTokenUseCase,
    private readonly cookieService: CookieService,
  ) {}
  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(
    @Req() req: any,
    @Ip() ip,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const loginData = await this.loginUseCase.execute(req.user, ip);
    res.cookie(
      'accessToken',
      `${loginData.accessToken}`,
      this.cookieService.getAccessTokenOptions(),
    );
    res.cookie(
      'refreshToken',
      `${loginData.refreshToken}`,
      this.cookieService.getRefreshTokenOptions(),
    );
    return loginData;
  }

  @ApiBody({ type: RefreshTokenDto })
  @Post('refresh-token')
  async refreshToken(
    @Req() req: any,
    @Body() data: RefreshTokenDto,
    @Ip() ip: string,
  ): Promise<any> {
    const refreshToken = data?.refreshToken || req.cookies.refreshToken;
    return this.refreshTokenUseCase.execute({ refreshToken }, ip);
  }

  @ApiBody({ type: RefreshTokenDto })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Post('revoke-token')
  async revokeToken(
    @Body() data: RefreshTokenDto,
    @Req() req: any,
    @Ip() ip: string,
  ): Promise<any> {
    const refreshToken = data?.refreshToken || req.cookies.refreshToken;
    const accessToken =
      req.headers?.authorization?.split(' ')[1] || req.cookies.accessToken;
    return this.revokeTokenUseCase.execute({ refreshToken, accessToken }, ip);
  }
}
