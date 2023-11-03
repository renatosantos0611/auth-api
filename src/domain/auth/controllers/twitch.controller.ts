import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CookieService } from '../services';

@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class TwitchController {
  constructor(
    private configService: ConfigService,
    private readonly cookieService: CookieService,
  ) {}

  @Get('twitch-redirect')
  async twitchRedirect(
    @Query('redirectTo') redirectTo: string,
    @Res() res: Response,
  ) {
    res.cookie('redirectTo', redirectTo);
    res.redirect('/auth/twitch');
  }

  @Get('twitch')
  @UseGuards(AuthGuard('twitch'))
  twitchAuth(): void {}

  @Get('twitch/callback')
  @UseGuards(AuthGuard('twitch'))
  twitchAuthRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
    res.cookie(
      'accessToken',
      `${req.user.accessToken}`,
      this.cookieService.getAccessTokenOptions(),
    );
    res.cookie(
      'refreshToken',
      `${req.user.refreshToken}`,
      this.cookieService.getRefreshTokenOptions(),
    );
    // const redirectTo = req.cookies?.redirectTo ?? authDefaultRedirect;
    res.clearCookie('redirectTo');
    res.redirect(`${this.configService.get<string>('API_URL')}dashboard`);
  }
}
