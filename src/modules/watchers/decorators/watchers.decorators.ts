import { OnEvent } from '@nestjs/event-emitter';

export class OnWatcher {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected constructor() {}

  protected static createDecorator(event: string) {
    return OnEvent(`watcher.${event}`);
  }

  static Created() {
    return this.createDecorator('created');
  }

  static Active() {
    return this.createDecorator('active');
  }

  static Paused() {
    return this.createDecorator('paused');
  }

  static Stopped() {
    return this.createDecorator('stopped');
  }
}
