import { IsOptional, IsEmail } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { UserToArtist } from '../entity/user.artist.entity';

export class UserSignupDto {
  @Expose({ name: 'userName' })
  @IsOptional()
    username: string;

  // TODO enum으로 리팩터링
  signupMethod: string;

  @IsEmail()
    email: string;

  @Transform(({ value }) => String(value))
  @IsOptional()
    password: string;

  @Transform(({ value }) => String(value))
  @IsOptional()
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

  isValidPassword(): boolean {
    return this.password.length > 7 && this.password === this.passwordCheck;
  }

  isOpener() {
    return this.signupMethod === 'opener';
  }

  hasArtists() {
    return this.myArtists?.length > 0;
  }
}
