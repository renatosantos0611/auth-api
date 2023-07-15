import { Injectable } from '@nestjs/common';
import { CookieOptions } from 'express';

@Injectable()
export class CookieService {
  getAccessTokenOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(new Date().setMinutes(new Date().getMinutes() + 10)),
    };
  }

  getRefreshTokenOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(new Date().setMinutes(new Date().getMinutes() + 60)),
    };
  }
}
