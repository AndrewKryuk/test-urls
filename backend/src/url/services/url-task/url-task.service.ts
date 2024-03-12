import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { Url } from '../../entities/url.entity';
import { Repository } from 'typeorm';
import { forkJoin, from, mergeMap, Observable, of, map, catchError } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UrlTaskService {
    private readonly logger = new Logger(UrlTaskService.name);

    constructor(@InjectRepository(Url)
                private urlRepository: Repository<Url>,
                private readonly http: HttpService,
                ) {
    }

    @Cron("*/2 * * * *")
    scheduledCheckAndUpdateUrls(): void {
        this.checkAndUpdateUrls$().subscribe();
    }

    checkAndUpdateUrls$(): Observable<Promise<void>> {
        return from(this.urlRepository.find({ where: { status: 'new' } }))
            .pipe(
                mergeMap((urls: Url[]) =>
                        forkJoin(urls.map((url: Url) =>
                                this.http.head(url.url)
                                    .pipe(
                                        map(({ status }) => {
                                            const isUrlValid = status >= 200 && status <= 299;
                                            url.status = isUrlValid ? 'valid' : 'wrong';
                                            url.statusCode = status;
                                            return url;
                                        }),
                                        catchError(() => {
                                            url.status = 'wrong';
                                            return of(url);
                                        })
                                    )
                            )
                        )
                ),
                map(async (urls: Url[]) => {
                    const result: Url[] = await this.urlRepository.save(urls);

                    this.logger.log(result, 'checkAndUpdateUrls$');
                }),
            );
    }
}