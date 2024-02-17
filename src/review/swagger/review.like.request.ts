import { ApiProperty } from '@nestjs/swagger';

export class ReviewLikeRequest {
  @ApiProperty({
    default: 'e6968dfc-ad25-43e5-8989-82b9db1afb09',
  })
    reviewId: string;

  @ApiProperty({
    default: 'cce311df-1c7e-49dd-8585-3a8217555eb1',
  })
    userId: string;

  @ApiProperty({ default: false })
    isLike: boolean;
}
