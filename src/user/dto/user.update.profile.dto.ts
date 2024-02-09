import { IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserUpdateProfileDto {
  @Expose({ name: 'nickName' })
  @IsOptional()
    alias: string;
}
