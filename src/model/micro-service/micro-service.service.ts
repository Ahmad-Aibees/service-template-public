import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {SystemIntegrationDbService} from '../database/system-integration-db.service';
import {systemServiceRoleType} from '../../common/types/system-service-role.type';
import {RequestServiceType} from '../../common/types/request-type';
import {LogDBService} from '../database/log-db.service';
import {LogModel} from '../database/model/log';
import {UrlHelpers} from '../../common/helpers/url-helpers';
import {ErrorHelper} from "../../common/helpers/error-helper";
import {Request, Response} from "express";
import * as moment from 'moment';
const FormData = require('form-data');
const axios = require('axios');
import * as fs from 'fs';

@Injectable()
export class MicroServiceService {
    constructor(
        private readonly systemIntegrationDbService: SystemIntegrationDbService,
        private readonly logDBService: LogDBService,
    ) {
    }

    protected async request(
        serviceRole: systemServiceRoleType,
        url: string,
        method: RequestServiceType,
        body?: Record<string, any> | Record<string, any>[],
        params?: Record<string, any>,
        query?: Record<string, any>,
        file?: string,
        req?: Request
    ): Promise<Record<string, any>> {
        const start = new Date();
        let service = await this.systemIntegrationDbService.findActive(serviceRole, !(+process.env.internal_service));

        if (!service) throw new InternalServerErrorException('not_found_' + serviceRole);

        let maxRetry = +process.env.ms_max_retry;

        let uri = !!(+process.env.internal_service) ? service.address : service.publicAddress;

        let endpoint = UrlHelpers.createUrl(uri + url, params, query);

        const currentService = await this.systemIntegrationDbService.getCurrentServiceRecord();

        const reqBody = {
            timeout: 15000,
            method,
            url: endpoint,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + currentService.token
            }
        };
        const formData = new FormData();
        if (file?.length) {
            if (body)
                for (const bodyKey in body) {
                    if (!body.hasOwnProperty(bodyKey)) continue;
                    formData.append(bodyKey, body[bodyKey]);
                }
            formData.append('file', fs.createReadStream(file));
        } else if (body) reqBody['data'] = JSON.stringify(body);

        let result;
        do {
            try {
                if (file?.length)
                    result = (await axios.post(endpoint, formData, {
                        maxContentLength: Infinity,
                        maxBodyLength: Infinity,
                        headers: {
                            'Content-Type': 'multipart/form-data; boundary=' + formData._boundary,
                            Authorization: 'Bearer ' + currentService.token,
                        },
                    }))?.data;
                else
                    //#endregion
                    result = (await axios(reqBody))?.data;
            } catch (e) {
                //log
                await this.logDBService.insert({
                    date: new Date(),
                    serviceProvider: serviceRole,
                    url: endpoint,
                    method: method,
                    request: reqBody,
                    statusCode: e?.response?.status ?? 0,
                    response: e?.response?.status ? e?.response?.data : e.message,
                } as LogModel);

                maxRetry--;
                if (e?.response?.status === 401) {
                    service = await this.systemIntegrationDbService.findActive(serviceRole, !!(+process.env.internal_service));
                    uri = !!(+process.env.internal_service) ? service.address : service.publicAddress;
                    endpoint = UrlHelpers.createUrl(uri + url, params, query);
                } else if (e?.response?.status === 400 || e?.response?.status === 403) {
                    result = ErrorHelper.createMsError(e.response?.data ?? e);
                    maxRetry = 0
                }

                if (!maxRetry && !result)
                    result = ErrorHelper.createMsError(e.response?.data ?? e);
            }
        } while (maxRetry);
        if (req && req['activityLog'])
            req['activityLog']['serviceStack'] = {
                ...(req['activityLog']['serviceStack'] ?? {}),
                [serviceRole]: moment().diff(start, 'milliseconds')
            }
        return result;
    }

    // TODO this is extra
    async forwardRequest(serviceRole: systemServiceRoleType, url: string, req: Request, res: Response, params?: Record<string, string | number>, query?: Record<string, string | number>): Promise<any> {
        const start = new Date();
        const service = await this.systemIntegrationDbService.findActive(serviceRole, !(+process.env.internal_service));

        const currentService = await this.systemIntegrationDbService.getCurrentServiceRecord();

        if (!service) throw new InternalServerErrorException('not_found_' + serviceRole);

        const uri = !!(+process.env.internal_service) ? service.address : service.publicAddress;

        const endpoint = UrlHelpers.createUrl(uri + url, params, query);
        let results;
        try {
            results = (await axios({
                url: endpoint,
                method: req.method,
                headers: {
                    ...req.headers,
                    Authorization: 'Bearer ' + currentService.token,
                },
                formData: new FormData(req.body)
            }))?.data;
        } catch (e) {
            throw e;
        }

        // const r = request.post({
        //     uri: endpoint,
        //     headers: {
        //         ...req.headers,
        //         Authorization: 'Bearer ' + currentService.token,
        //     },
        //     formData: req.body
        // });
        // req.pipe(r).pipe(res);
        if (req && req['activityLog'])
            req['activityLog']['serviceStack'] = {
                ...(req['activityLog']['serviceStack'] ?? {}),
                serviceRole: moment().diff(start, 'milliseconds')
            }

        return results;
    }
}
