import { Expose } from 'class-transformer';

export class ArtistRequestCreateResponse {
  @Expose({ name: 'id' })
    result: string;
}
