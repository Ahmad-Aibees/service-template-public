import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {BaseModel} from "./base/base";
import {systemServiceRoleType, systemServiceRoleTypeList} from "../../../common/types/system-service-role.type";

export const SystemIntegrationDB = 'systemIntegration';

@Schema({ versionKey: false, collection: 'services' })
export class SystemIntegrationModel extends BaseModel {
    @Prop({ required: true, type: String, index: true })
    label: string;

    @Prop({ required: true, enum: systemServiceRoleTypeList, index: true })
    role: systemServiceRoleType;

    @Prop({ required: true, type: String, index: true })
    token: string;

    @Prop({ required: true, type: String, unique: true })
    address: string;

    @Prop({ required: false, type: String, unique: true })
    publicAddress?: string;

    @Prop({ required: true, enum: ['up', 'down'] })
    status: 'up' | 'down';

    @Prop({ required: false, type: Number })
    exitCode?: number;

    @Prop({ required: false, type: Date })
    lastCheckIn: Date;
}

export const SystemIntegrationSchema = SchemaFactory.createForClass(SystemIntegrationModel);

SystemIntegrationSchema.index({ address: 1 }, { unique: true, ignoreUndefined: false })

SystemIntegrationSchema.index({ publicAddress: 1 }, { unique: true, ignoreUndefined: true })
