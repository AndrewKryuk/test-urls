import {Controller, Get, Post, Body, Param, Delete, UseInterceptors } from '@nestjs/common';
import { UrlService } from '../services/url/url.service';
import { CreateUrlDto } from '../dto/create-url.dto';
import { Observable } from 'rxjs';
import { Url } from '../entities/url.entity';
import { DeleteResult } from 'typeorm';
import { TransformInterceptor } from '../../core/interceptors/transform.interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Url')
@Controller({
  version: '1',
  path: 'url'
})
@UseInterceptors(TransformInterceptor)
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @ApiOperation({ summary: "Add url for checking as wrong or valid" })
  create(@Body() createUrlDto: CreateUrlDto): Observable<Url> {
    return this.urlService.create$(createUrlDto);
  }

  @Get('list')
  @ApiOperation({ summary: "Get full url list" })
  findAll(): Observable<Url[]> {
    return this.urlService.findAll$();
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete url by id" })
  remove(@Param('id') id: string): Observable<DeleteResult> {
    return this.urlService.remove$(+id);
  }
}
