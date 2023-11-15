import {Controller, Get, Param, Req} from "@nestjs/common";
import {LocationService} from "./location.service";
import {ApiStateListRs} from "../../model/micro-service/response-nodels/location.response";
import {Request} from "express";
import {ApiDefaultResponse, ApiOperation, ApiParam} from "@nestjs/swagger";
import {ObjectIdPipe} from "../../common/pipes/object-id";
import {Types} from "mongoose";

@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) {
    }

    @ApiOperation({ summary: 'Get States List' })
    @ApiDefaultResponse({ type: [ApiStateListRs] })
    @Get('states')
    async getStatesList(
        @Req() req: Request
    ): Promise<ApiStateListRs[]> {
        return this.locationService.getStateList(req);
    }

    @ApiOperation({ summary: 'Get States List' })
    @ApiParam({ name: 'stateId', required: true, type: String })
    @ApiDefaultResponse({ type: [ApiStateListRs] })
    @Get('cities/:stateId')
    async getCitiesList(
        @Param('stateId', new ObjectIdPipe('stateId')) stateId: Types.ObjectId,
        @Req() req: Request
    ): Promise<ApiStateListRs[]> {
        return this.locationService.getCityList(stateId, req);
    }
}
