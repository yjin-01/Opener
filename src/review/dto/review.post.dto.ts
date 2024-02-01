import {
  IsUrl, IsBoolean, Length, IsString,
} from 'class-validator';

export class ReviewPostDto {
  @IsString()
    userId: string;

  @IsString()
    eventId: string;

  @IsBoolean()
    isPublic: boolean;

  @IsBoolean()
    rating: boolean;

  @Length(0, 100)
    description: string;

  @IsUrl({}, { each: true })
    reviewImages: string[] | [];

  @IsBoolean()
    isAgree: boolean;

  toReviewImages(reviewId) {
    return this.reviewImages.map((url) => ({
      reviewId,
      userId: this.userId,
      url,
    }));
  }
}
