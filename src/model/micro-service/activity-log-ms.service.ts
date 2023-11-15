import { Injectable } from '@nestjs/common';
import { MicroServiceService } from './micro-service.service';
import { Request } from 'express';
import { isError } from '@nestjs/cli/lib/utils/is-error';
import { Types } from 'mongoose';

@Injectable()
export class ActivityLogMsService extends MicroServiceService {
    async initializeLog(req: Request): Promise<{ id: string }> {
        const response = await this.request('activity-log-service', '/activity-log/create', 'POST', {
            ip: req.ip,
            headers: req.headers,
            domain: req.headers.origin,
            url: req.url,
            requestBody: req.body
        });

        if (isError(response) || !response)
            return { id: null };

        return { id: response['id'] };
    }

    async completeLog(logId: string, userId: Types.ObjectId, clientId: Types.ObjectId, status: number, body: Record<string, any>): Promise<void> {
        await this.request('activity-log-service', '/activity-log/update/:logId', 'PATCH', {
            userId: userId?.toHexString(),
            clientId: clientId?.toHexString(),
            responseStatus: status,
            responseBody: body ?? {}
        }, { logId });
    }
}
