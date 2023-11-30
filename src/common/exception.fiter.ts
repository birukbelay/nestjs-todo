// graphql-exception.filter.ts
import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
// import { ApolloError } from 'apollo-server-errors';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext();

    if (exception instanceof HttpException) {
      // If it's a regular HTTP exception, return it directly
      return exception;
    }

    // Handle other errors as GraphQL errors
    const message = exception.message || 'Internal server error';
    const code = 'INTERNAL_SERVER_ERROR';

    const apolloError = new HttpException(message, 500);
    return apolloError;
  }
}