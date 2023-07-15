import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isNumber } from 'class-validator';
import { RoleEnum } from 'src/domain/user/enums';
import { UserService } from 'src/domain/user/services';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the request object from the execution context
    const request = context.switchToHttp().getRequest();

    // Extract the user id from the JWT token
    const userId = Number(request.user.id);

    // Extract the id from the request URL
    const id = request.params.id ? Number(request.params.id) : userId;
    // valdate if id is a number
    if (!isNumber(id)) throw new BadRequestException('id param inválido');

    const user = await this.userService.findUserById(userId);

    const allowedRoles = [RoleEnum.ADMIN, RoleEnum.SUPERADMIN];
    if (allowedRoles.includes(user?.role)) {
      // If the user's role is in the list of allowed roles, allow access
      return true;
    }

    // Compare the id from the JWT token to the id from the request URL

    if (user?.role === RoleEnum.USER && userId != id)
      throw new UnauthorizedException(
        'Você não tem permissão para acessar esse usuário',
      );

    return true;
  }
}
