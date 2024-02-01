import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { GroupResponse } from '../swagger/group.response';

@Injectable()
export class GroupCreateResponseInterceptor<T>
implements NestInterceptor<T, GroupResponse> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const result = plainToClass(GroupResponse, data);
        return result;
      }),
    );
  }
}
