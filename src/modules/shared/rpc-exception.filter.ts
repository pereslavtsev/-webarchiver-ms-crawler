import {
  Catch,
  HttpException,
  ExceptionFilter,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException): Observable<any> {
    switch (exception.constructor) {
      case BadRequestException: {
        return throwError(
          new RpcException({
            code: status.INVALID_ARGUMENT,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            message: exception.getResponse().message.join(),
          }),
        );
      }
      default: {
        return throwError(exception);
      }
    }
  }
}
