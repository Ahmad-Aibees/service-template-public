import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Identity } from '../../application/auth/models/identity';
import { LogDBService } from '../../model/database/log-db.service';
import { LogModel } from '../../model/database/model/log';
import { ActivityLogMsService } from '../../model/micro-service/activity-log-ms.service';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
    constructor(
        private readonly logDBService: LogDBService,
        private readonly activityLogMsService: ActivityLogMsService
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((response: any) => {
                const http = context.switchToHttp();
                const req = http.getRequest<Request>();

                const user: Identity = req['identity'];
                // Response log
                if (req['activityLog'] && req['activityLog']['id']) {
                    this.activityLogMsService.completeLog(req['activityLog']['id'], user?.userId, user?.clientId, 200, response)
                }
                this.logDBService.insert({
                    date: new Date(),
                    url: req.url,
                    method: req.method,
                    request: { url: req.url, body: req.body, header: req.headers },
                    statusCode: 200,
                    response: response || ' ',
                    user: user?.userId?.toHexString(),
                } as LogModel);

                return response;
            }),
        );
    }
}
