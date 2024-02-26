import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { EventRepository } from 'src/event/event.repository';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { ArtistRepository } from './artist.repository';
import { Artist } from './entity/artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist]), EntityManager],
  controllers: [ArtistController],
  providers: [ArtistRepository, ArtistService, EventRepository],
})
export default class ArtistModule {}
