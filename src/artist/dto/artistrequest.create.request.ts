import { IsString } from 'class-validator';

export class ArtistRequestCreateRequest {
  @IsString()
    name: string;
}
