import { Transport, ClientOptions } from '@nestjs/microservices';
import { resolve } from 'path';
import protoc from '@webarchiver/protoc';

const port = process.env.PORT || 50051;

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: `0.0.0.0:${port}`,
    package: protoc.crawler.protobufPackage,
    protoPath: resolve(
      'node_modules',
      '@webarchiver/protoc',
      'dist',
      'crawler',
      'crawler.proto',
    ),
  },
};
