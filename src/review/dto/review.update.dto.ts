import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

type UpdateTarget = {
  userId: string;
  eventId: string;
  id: string;
};

type UpdateValue = {
  isPublic: boolean;
  rating: boolean;
  description: string;
};

export class ReviewUpdateDto {
  private userId: string;

  private eventId: string;

  @Expose({ name: 'reviewId' })
  private id: string;

  @IsOptional()
  private isPublic: boolean;

  @IsOptional()
  private rating: boolean;

  @IsOptional()
  private description: string;

  getUpdateTarget(): UpdateTarget {
    return {
      userId: this.userId,
      eventId: this.eventId,
      id: this.id,
    };
  }

  getUpdateValue(): UpdateValue {
    return {
      isPublic: this.isPublic,
      rating: this.rating,
      description: this.description,
    };
  }

  getEventId(): string {
    return this.eventId;
  }

  getUserId(): string {
    return this.userId;
  }

  getReviewId(): string {
    return this.id;
  }
}
