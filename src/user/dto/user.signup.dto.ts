import { IsOptional, IsEmail, Length } from 'class-validator';
import { Expose } from 'class-transformer';
import { UserToArtist } from '../entity/user.artist.entity';

export class UserSignupDto {
  @Expose({ name: 'userName' })
  @IsOptional()
    username: string;

  // TODO enum으로 리팩터링
  @IsOptional()
    signupMethod: string;

  @IsEmail()
    email: string;

  @Length(8, 20)
    password: string;

  @Length(8, 20)
    passwordCheck: string;

  @Expose({ name: 'nickName' })
  @IsOptional()
    alias: string;

  @IsOptional()
    myArtists: string[] | [];

  extractArtists(userId: string): any[] {
    return this.myArtists.map((artistId) => new UserToArtist(userId, artistId));
  }

  async encrypt(configService, fn) {
    this.password = await fn(configService, this.password);
  }

  isMatchedPassword(): boolean {
    return this.password === this.passwordCheck;
  }
}
