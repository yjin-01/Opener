import { Module } from '@nestjs/common';
import { EventRepository } from 'src/event/event.repository';
import { UserRepositoryImple } from 'src/user/user.repository.impl';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepositoryImpl } from './review.repositoryImple';

@Module({
  controllers: [ReviewController],
  providers: [
    ReviewService,
    { provide: 'ReviewRepository', useClass: ReviewRepositoryImpl },
    EventRepository,
    { provide: 'UserRepository', useClass: UserRepositoryImple },
  ],
})
export default class ReviewModule {}
