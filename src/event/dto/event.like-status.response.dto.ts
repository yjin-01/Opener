import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class EventLikeStatusDto {
  @ApiProperty({
    description: '좋아요 여부 => userId없는 경우(비로그인) false 반환',
    default: 'false',
  })
  @Expose()
    status: boolean;

  @ApiProperty({
    description: '좋아요 수',
    default: 1,
  })
  @Expose()
  @Type(() => Number)
    likeCount: number;
}
