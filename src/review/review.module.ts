import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepositoryImpl } from './review.repositoryImple';

@Module({
  controllers: [ReviewController],
  providers: [
    ReviewService,
    { provide: 'ReviewRepository', useClass: ReviewRepositoryImpl },
  ],
})
export default class ReviewModule {}
