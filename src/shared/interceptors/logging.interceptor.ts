import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CoreProvider } from '@crawler/shared';
import { Bunyan, RootLogger } from '@eropple/nestjs-bunyan';
import { v4 as uuidv4 } from 'uuid';
import { grpcClientOptions } from '../../grpc.options';

@Injectable()
export class LoggingInterceptor
  extends CoreProvider
  implements NestInterceptor
{
  constructor(@RootLogger() rootLogger: Bunyan) {
    super(rootLogger);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const data = context.switchToRpc().getData();
    const metadata = context.switchToRpc().getContext();
    const reqId = metadata['x-correlation-id'] ?? uuidv4();
    const log = this.log.child({
      reqId,
      req: {
        method: context.getClass().name,
        url:
          '/' +
          grpcClientOptions.options['package'] +
          '.' +
          context.getClass().name +
          '/' +
          context.getHandler().name,
      },
      res: {},
    });

    log.info({ data, metadata }, `Calling ${context['contextType']} method...`);

    const now = Date.now();
    return next.handle().pipe(
      tap(() =>
        log.info(
          {
            data,
            metadata,
            res: { responseTime: Date.now() - now },
          },
          `Finished`,
        ),
      ),
    );
  }
}
