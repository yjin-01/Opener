import { IsOptional, IsEmail } from 'class-validator';
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

  @IsOptional()
    password: string;

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
}
