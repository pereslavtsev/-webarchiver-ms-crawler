import { OnEvent } from '@nestjs/event-emitter';

export class OnWorker {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected constructor() {}

  protected static createDecorator(event: string) {
    return OnEvent(`worker.${event}`);
  }

  static Data() {
    return this.createDecorator('data');
  }

  static Started() {
    return this.createDecorator('started');
  }

  static Finished() {
    return this.createDecorator('started');
  }

  static Failed() {
    return this.createDecorator('started');
  }
}
