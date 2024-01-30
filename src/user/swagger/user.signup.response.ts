import { ApiProperty } from '@nestjs/swagger';
import { UserToArtist } from '../entity/user.artist.entity';

export class UserSignupResponse {
  @ApiProperty({
    description: '회원 가입된 유저 아이디',
    default: '9293e343-ea1f-43',
  })
    userId: string;

  @ApiProperty({ description: '회원 가입된 유저 이름', default: 'test' })
    username: string;

  @ApiProperty({
    description: '회원 가입된 유저 이메일',
    default: 'test@test.com',
  })
    email: string;

  @ApiProperty({ description: '회원 가입 유저 별명', default: 'p1z7' })
    nickName: string;

  @ApiProperty({
    description: '가입한 유저의 아티스트들',
    default: [
      {
        userId: '380aba06-570c-439f-9187-8a46d516e93f',
        artistId: '4dd6af2f-616e-42',
        id: '64ba722d-58f4-4b58-886c-ed7f948b9d03',
      },
      {
        userId: '380aba06-570c-439f-9187-8a46d516e93f',
        artistId: '13ea2845-69ed-47',
        id: '9b47b74d-52ba-4174-83a1-f478f779bb1e',
      },
      {
        userId: '380aba06-570c-439f-9187-8a46d516e93f',
        artistId: '5c6141ab-cf30-48',
        id: 'ef98ce56-5f59-4cbd-abfe-325bd18d42a5',
      },
    ],
  })
    myArtists: UserToArtist[];
}
