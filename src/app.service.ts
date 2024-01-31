import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private hello = 'Hello World!!!!!!!';

  getHello(): string {
    return this.hello;
  }
}
