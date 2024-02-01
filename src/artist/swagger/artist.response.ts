import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ArtistResponse {
  @ApiProperty({
    description: '등록된 아티스트 이름',
    default: '53bdc763-2036-4d',
  })
  @Expose()
    id: string;

  @ApiProperty({
    description: '등록 가입된 아티스트 이름',
    default: 'test_artist',
  })
  @Expose()
    artistName: string;

  @ApiProperty({
    description: '등록된 아티스트 생일',
    default: '2016-01-01',
  })
  @Expose()
    birthday: Date;

  @ApiProperty({
    description: '등록된 아티스트 이미지 url',
    default: 'http://image.co.kr',
  })
  @Expose()
    artistImage: string;

  // @ApiPropertyOptional({
  //   description: '등록된 아티스트의 그룹 ID => 없거나 null인경우 솔로 입니다.',
  //   default: '53bdc763-2036-4d',
  // })
  // @Expose()
  // groupId?: string;

  // @ApiPropertyOptional({
  //   description:
  //     '등록된 아티스트의 그룹 이름 => 없거나 null인경우 솔로 입니다.',
  //   default: 'test_group',
  // })
  // @Expose()
  // groupName?: string;
}
