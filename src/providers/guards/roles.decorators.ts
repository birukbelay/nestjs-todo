import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../../common/types.model';

export const ROLES_KEY = 'roles';
// this is a decorator to specify allowed Roles in a handler
export const AllowedRoles = (...roles: Array<RoleType>) =>
  SetMetadata(ROLES_KEY, roles);
