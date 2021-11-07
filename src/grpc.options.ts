import { Transport, ClientOptions } from '@nestjs/microservices';
import { join } from 'path';
import { protobufPackage } from '@crawler/proto/watcher';

const port = process.env.PORT || 50051;

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: `0.0.0.0:${port}`,
    package: protobufPackage,
    protoPath: join(__dirname, 'proto', 'watcher.proto'),
  },
};
