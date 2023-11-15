import { Injectable } from '@nestjs/common';
import { MicroServiceService } from './micro-service.service';
import fs from 'fs';
import { isError } from '@nestjs/cli/lib/utils/is-error';
import { Types } from 'mongoose';
import { Request } from 'express';

@Injectable()
export class NotificationMsService extends MicroServiceService {
    async initializeSmsTemplates(): Promise<void> {
        const data = fs.readFileSync(`${process.env.seed_folder}/message-template.json`, 'utf8');

        const templates = JSON.parse(data);

        if (templates?.length) {
            const results = await this.request('notification-service', '/message-template', 'POST', templates);
            if (isError(results))
                throw results;
        }
    }

    async sendVerificationCode(code: string, mobile: string, clientId: Types.ObjectId, req: Request): Promise<void> {
        const results = await this.request('notification-service', '/sms/kavenegar/:clientId', 'POST', {
            mobile,
            smsType: 'verification-code',
            input: {
                code
            }
        }, { clientId: clientId.toHexString() }, undefined, undefined, req);

        if (isError(results)) throw results;
    }
}
