import {Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { ip, method, path: url } = request;
        const userAgent = request.get('user-agent') || '';

        const now = Date.now();

        return next
            .handle()
            .pipe(
                tap(() => {
                    const response = context.switchToHttp().getResponse();
                    const { statusCode } = response;

                    this.logger.log(
                        `${method} ${url} ${statusCode} - ${userAgent} ${ip} ${Date.now() - now}ms`
                    );
                }),
            );
    }
}