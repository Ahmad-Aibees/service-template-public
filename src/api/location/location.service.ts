import {Injectable} from "@nestjs/common";
import {LocationMsService} from "../../model/micro-service/location-ms.service";
import {ApiCityListRs, ApiStateListRs} from "../../model/micro-service/response-nodels/location.response";
import {Request} from "express";
import {Types} from "mongoose";

@Injectable()
export class LocationService {
    constructor(private readonly locationMsService: LocationMsService) {
    }

    async getStateList(req: Request): Promise<ApiStateListRs[]> {
        return this.locationMsService.getStates(req);
    }

    async getCityList(stateId: Types.ObjectId, req: Request): Promise<ApiCityListRs[]> {
        return this.locationMsService.getCities(stateId.toHexString(), req);
    }
}
