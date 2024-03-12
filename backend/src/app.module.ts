import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UrlModule } from './url/url.module';
import { HttpModule } from '@nestjs/axios';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import config from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          load: [config]
      }),
      HttpModule,
      ScheduleModule.forRoot(),
      TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (config: ConfigService) => config.get('database'),
          inject: [ConfigService],
      }),
      UrlModule,
  ],
  controllers: [],
  providers: [
      {
          provide: APP_INTERCEPTOR,
          useClass: LoggingInterceptor,
      }
  ],
})
export class AppModule {}
