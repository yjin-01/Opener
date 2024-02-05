import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ArtistRepository } from 'src/artist/artist.repository';
import { Event } from './entity/event.entity';
import { EventRepository } from './event.repository';
import { EventService } from './event.service';
import { EventController } from './event.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), EntityManager],
  controllers: [EventController],
  providers: [ArtistRepository, EventRepository, EventService],
})
export default class EventModule {}
