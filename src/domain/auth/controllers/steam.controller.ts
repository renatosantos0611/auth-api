import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Query,
    Req,
    Res,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { authDefaultRedirect } from '../constants';
import { CookieService } from '../services';

@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class SteamController {
    constructor(
        private readonly cookieService: CookieService,
    ) { }

    @Get('steam-redirect')
    async steamRedirect(@Query('redirectTo') redirectTo: string, @Res() res: Response) {
        res.cookie(
            'redirectTo',
            `${redirectTo || authDefaultRedirect}`
        );
        res.redirect('/auth/steam');
    }

    @Get('steam')
    @UseGuards(AuthGuard('steam'))
    async steamAuth(@Res({ passthrough: true }) res: Response): Promise<void> { }

    @Get('steam/return')
    @UseGuards(AuthGuard('steam'))
    steamAuthRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
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
        const redirectTo = req.cookies.redirectTo || authDefaultRedirect;
        res.redirect(`http://localhost:3000/${redirectTo}`);
    }
}
