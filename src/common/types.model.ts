import { ObjectType, registerEnumType } from '@nestjs/graphql';

export enum RoleType  {
    USER = 'USER',
    ADMIN = 'ADMIN',
}


export class UserFromToken {
    id?: number;
    role?: string;
}

//Auth-token.object-types
@ObjectType()
export class AuthToken {
  accessToken?: string;

  refreshToken?: string;

}

