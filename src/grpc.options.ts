import { Transport, ClientOptions } from '@nestjs/microservices';
import { join } from 'path';
import { protobufPackage } from '@crawler/proto/watcher';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: 'localhost:9090',
    package: protobufPackage,
    protoPath: join(__dirname, 'proto', 'watcher.proto'),
  },
};
