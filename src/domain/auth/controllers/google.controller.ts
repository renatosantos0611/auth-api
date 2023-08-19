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
export class GoogleController {
    constructor(
        private readonly cookieService: CookieService,
    ) { }

    @Get('google-redirect')
    async googleRedirect(@Query('redirectTo') redirectTo: string, @Res() res: Response) {
        res.cookie(
            'redirectTo',
            `${redirectTo || authDefaultRedirect}`
        );
        res.redirect('/auth/google');
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Res({ passthrough: true }) res: Response): Promise<void> { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
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
