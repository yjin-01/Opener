import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Group } from './entity/group.entity';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupRepository } from './group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), EntityManager],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository],
})
export default class GroupModule {}
