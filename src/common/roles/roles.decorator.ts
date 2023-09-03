import { SetMetadata } from '@nestjs/common';
import { Roles } from '../roles/role.enum';

export const ROLE_KEY = 'role';
export const Role = (roles: Roles[]) => SetMetadata(ROLE_KEY, roles); 
