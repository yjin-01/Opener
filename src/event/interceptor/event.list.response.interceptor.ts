import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import {
  EventListByCursorRespone,
  EventListByPageResponseDto,
} from '../dto/event.list.response.dto';
import { Event } from '../entity/event.entity';

@Injectable()
export class EventListByPageResponseInterceptor<T>
implements NestInterceptor<T, EventListByPageResponseDto> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const result = plainToClass(EventListByPageResponseDto, data);
        return result;
      }),
    );
  }
}

@Injectable()
export class EventListByCursorResponseInterceptor<T>
implements NestInterceptor<T, EventListByCursorRespone> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const result = plainToClass(EventListByCursorRespone, data);
        return result;
      }),
    );
  }
}

@Injectable()
export class EventListResponseInterceptor<T>
implements NestInterceptor<T, Event> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const result = plainToClass(Event, data);
        return result;
      }),
    );
  }
}
