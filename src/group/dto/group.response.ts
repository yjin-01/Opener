import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class GroupResponse {
  @ApiProperty({
    description: '등록된 그룹 이름',
    default: '53bdc763-2036-4d',
  })
  @Expose()
    groupId: string;

  @ApiProperty({ description: '등록 가입된 그룹 이름', default: 'test_group' })
  @Expose()
    groupName: string;

  @ApiProperty({
    description: '등록된 그룹 데뷔일',
    default: '2016-01-01',
  })
  @Expose()
    debutDate: Date;

  @ApiProperty({
    description: '등록된 그룹 이미지 url',
    default: 'http://image.co.kr',
  })
  @Expose()
    groupImage: string;
}
