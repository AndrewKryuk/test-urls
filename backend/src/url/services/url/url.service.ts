import {Injectable, Logger} from '@nestjs/common';
import { CreateUrlDto } from '../../dto/create-url.dto';
import { Url }  from '../../entities/url.entity';
import {DeleteResult, Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';

@Injectable()
export class UrlService {
  private readonly logger = new Logger(UrlService.name);

  constructor(@InjectRepository(Url)
              private urlRepository: Repository<Url>) {
  }
  create$(createUrlDto: CreateUrlDto): Observable<Url> {
    return from(this.urlRepository.save(createUrlDto));
  }

  findAll$(): Observable<Url[]> {
    return from(this.urlRepository.find());
  }

  remove$(id: number): Observable<DeleteResult> {
    return from(this.urlRepository.delete(id));
  }
}
