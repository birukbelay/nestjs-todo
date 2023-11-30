import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { IncomingMessage } from 'http';
// import { JwtPayload } from 'jsonwebtoken';
//Local dependencies
import { ROLES_KEY } from './roles.decorators';
//common
import { RoleType, UserFromToken } from '../../common/types.model';
import { CustomJwtService } from '../crypto/jwt.service';

// Verify Token from a graphql Request this  verifies the jwt & the Roles : This is Enough for our app
@Injectable()
export class GqlJwtGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly jwtService: CustomJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //
    const request = this.getRequest<IncomingMessage & { user?: Record<string, unknown> }>(context); // you could use FastifyRequest here too
    try {
      // ==============================     Authentication  ==============
      const token = this.getToken(request);
      const resp = await this.jwtService.verifyAccessToken(token);
      if (!resp.ok) return false;
      request.user = resp.val as any;
      const user = resp.val;

      // ========================================= Authorization =======================

      //                           ********  Getting the roles from the handler
      //Roles defined by the top class & handler merged together
      const allowedRoles = this.reflector.getAllAndMerge<RoleType[]>(ROLES_KEY, [
        context.getClass(),
        context.getHandler(),
      ]);
      //              *********************************

      // If no roles are found it can continue.
      if (allowedRoles.length < 1) return true;
      // Make sure always pass for 'ADMIN'
      allowedRoles.push(RoleType.ADMIN);

      // User must have role & the value of role must match with @RoleGuard('value_role')
      return user.role && allowedRoles.includes(user.role as RoleType);
    } catch (e) {
      // return false or throw a specific error if desired
      return false;
    }
  }

  protected getRequest<T>(context: ExecutionContext): T {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
    // return context.switchToHttp().getRequest()
  }

  protected getToken(request: { headers: Record<string, string | string[]> }): string {
    const authorization = request.headers['authorization'];
    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }

    return authorization;
  }
}
