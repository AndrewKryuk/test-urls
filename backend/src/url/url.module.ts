import { Module } from '@nestjs/common';
import { UrlService } from './services/url/url.service';
import { UrlController } from './controller/url.controller';
import { UrlTaskService } from './services/url-task/url-task.service';
import { Url } from './entities/url.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Url])],
  controllers: [UrlController],
  providers: [UrlService, UrlTaskService],
})
export class UrlModule {}
