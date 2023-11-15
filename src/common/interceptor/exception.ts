import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Identity } from '../../application/auth/models/identity';
import { LogDBService } from '../../model/database/log-db.service';
import { LogModel } from '../../model/database/model/log';
import { ActivityLogMsService } from '../../model/micro-service/activity-log-ms.service';

@Catch()
export class ExceptionInterceptor implements ExceptionFilter {
    constructor(
        private readonly logDBService: LogDBService,
        private readonly activityLogMsService: ActivityLogMsService
    ) {}

    catch(exception: any, host: ArgumentsHost) {
        const http = host.switchToHttp();
        const req = http.getRequest<Request>();
        const res = http.getResponse<Response>();

        const status: number = exception.getResponse ? exception.getResponse().statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
        const error = exception.getResponse ? exception.getResponse().message : { message: exception.message, stack: exception.stack };

        //console.log(status, exception);

        const user: Identity = req['identity'];
        // Response log
        this.logDBService.insert({
            date: new Date(),
            url: req.url,
            method: req.method,
            request: { url: req.url, body: req.body, header: req.headers },
            statusCode: status,
            response: error || ' ',
            user: user?.userId?.toHexString(),
        } as LogModel);

        if (req['activityLog'] && req['activityLog']['id']) {
            this.activityLogMsService.completeLog(req['activityLog']['id'], user?.userId, user?.clientId, status, { statusCode: status, error })
        }

        res.status(status).json({ statusCode: status, error });
    }
}
