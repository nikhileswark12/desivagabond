import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import * as path from 'path';
import * as fs from 'fs';
import { dataSourceOptions } from './data-source';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TripsModule } from './trips/trips.module';
import { CitiesModule } from './cities/cities.module';
import { ActivitiesModule } from './activities/activities.module';
import { AdminModule } from './admin/admin.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      errorMessage: 'Too many requests, please try again later.',
      throttlers: [{ ttl: 60000, limit: 10 }],
    }),
    CacheModule.register({ isGlobal: true, ttl: 3600000 }), // 1 hour in ms for cache-manager v5
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ...dataSourceOptions,
          autoLoadEntities: true,
          synchronize: process.env.NODE_ENV !== 'production',
          logging: false,
        } as any;
      },
    }),
    AuthModule,
    UsersModule,
    TripsModule,
    CitiesModule,
    ActivitiesModule,
    AdminModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
