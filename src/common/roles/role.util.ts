import { Injectable } from '@nestjs/common';
import Role from './role.enum';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class RoleUtil {
  constructor(private readonly usersService: UsersService) {}

  public async userHasRole(
    userid: string,
    requiredRoles: Role[],
  ): Promise<boolean> {
    const userRoles = await this.usersService.findRolesOfUser(userid);

    if (!userRoles) return false;

    return this.roleHasAction(userRoles, requiredRoles);
  }

  public roleHasAction(roles: Role[], requiredRoles: Role[]): boolean {
    for (const role of requiredRoles) {
      if (roles.includes(role)) return true;
    }
    return false;
  }
}
