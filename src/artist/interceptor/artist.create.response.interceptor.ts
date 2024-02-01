import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { ArtistResponse } from '../swagger/artist.response';

@Injectable()
export class ArtistCreateResponseInterceptor<T>
implements NestInterceptor<T, ArtistResponse> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const result = plainToClass(ArtistResponse, data);
        return result;
      }),
    );
  }
}
