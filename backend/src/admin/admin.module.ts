import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { User } from '../users/user.entity';
import { AuditLog } from './entities/audit-log.entity';
import { TripsModule } from '../trips/trips.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuditLog]), TripsModule, UsersModule],
  controllers: [AdminController],
})
export class AdminModule {}
