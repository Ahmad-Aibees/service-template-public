import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {SystemIntegrationDB, SystemIntegrationModel} from "./model/system-integration";
import {Model} from "mongoose";
import {RandomKeyHelper} from "../../common/helpers/random-key-helper";
import {FilterQuery} from "mongodb";
import {systemServiceRoleType} from "../../common/types/system-service-role.type";
import * as moment from 'moment';

@Injectable()
export class SystemIntegrationDbService {
    constructor(@InjectModel(SystemIntegrationDB) private readonly systemIntegrationModel: Model<SystemIntegrationModel>) {
    }

    async registerService(): Promise<void> {
        const token = RandomKeyHelper.create(16, RandomKeyHelper.alphaUpperNumeric);
        await this.systemIntegrationModel.findOneAndUpdate({ label: process.env.service_label },{
            label: process.env.service_label,
            role: process.env.service_role as systemServiceRoleType,
            address: process.env.service_inner_address,
            publicAddress: process.env.service_address,
            token,
            status: 'up',
            exitCode: null,
            lastCheckIn: moment().toDate()
        }, { upsert: true }).exec();
    }

    async exitService(): Promise<void> {
        await this.systemIntegrationModel.findOneAndDelete({ label: process.env.service_label }).exec();
    }

    async findOne(filter: FilterQuery<SystemIntegrationModel>): Promise<SystemIntegrationModel> {
        return this.systemIntegrationModel.findOne(filter).exec();
    }

    async findActive(role: systemServiceRoleType, external = false): Promise<SystemIntegrationModel> {
        return this.systemIntegrationModel.findOne({
            role, publicAddress:  external ? { $exists: true }: undefined
        }, undefined, { sort: { lastCheckIn: -1 } }).exec();
    }

    async getCurrentServiceRecord(): Promise<SystemIntegrationModel> {
        return this.systemIntegrationModel.findOne({ label: process.env.service_label });
    }
}
