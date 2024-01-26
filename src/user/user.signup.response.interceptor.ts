import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { UserSignupResponse } from './dto/user.signup.response';

@Injectable()
export class UserSignupResponseInterceptor<T>
implements NestInterceptor<T, UserSignupResponse> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const result = plainToClass(UserSignupResponse, data);
        return result;
      }),
    );
  }
}
