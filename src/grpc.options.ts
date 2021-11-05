import { Transport, ClientOptions } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: 'localhost:9090',
    package: 'webarchiver.crawler.v1',
    protoPath: join(__dirname, 'watchers', 'controllers', 'watcher.proto'),
  },
};
