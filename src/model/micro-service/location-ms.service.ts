import {Injectable} from "@nestjs/common";
import {MicroServiceService} from "./micro-service.service";
import {ApiCityListRs, ApiStateListRs} from "./response-nodels/location.response";
import {Request} from "express";
import {isError} from "@nestjs/cli/lib/utils/is-error";

@Injectable()
export class LocationMsService extends MicroServiceService {
    async getStates(req: Request): Promise<ApiStateListRs[]> {
        const result = await this.request('location-service', '/state', 'GET', undefined, undefined, undefined, undefined, req);

        if (isError(result)) throw result;

        return result.map(s => new ApiStateListRs(s));
    }

    async getCities(stateId: string, req: Request): Promise<ApiCityListRs[]> {
        const result = await this.request('location-service', '/city/by-state/:stateId', 'GET', undefined, {
            stateId
        }, undefined, undefined, req);

        if (isError(result)) throw result;

        return result.map(s => new ApiCityListRs(s));
    }
}
