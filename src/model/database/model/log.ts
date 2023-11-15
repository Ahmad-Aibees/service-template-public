import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from './base/base';
import * as mongoose from 'mongoose';
import { RequestServiceType, RequestTypesList } from '../../../common/types/request-type';

export const LogDB = 'Log';

@Schema({ versionKey: false, collection: 'log' })
export class LogModel extends BaseModel {
    @Prop({ required: true, type: Date })
    date: Date;

    @Prop({ required: false, type: String })
    serviceProvider: string;

    @Prop({ required: true, type: String })
    url: string;

    @Prop({ required: true, enum: RequestTypesList })
    method: RequestServiceType;

    @Prop({ required: true, type: Object })
    request: any;

    @Prop({ required: true, type: Number })
    statusCode: number;

    @Prop({ required: true, type: Object })
    response: any;

    @Prop({ required: false, type: String })
    dashUser: string;

    //logined user
    @Prop({ required: false, type: String })
    user: string;
}

export const LogSchema: mongoose.Schema = SchemaFactory.createForClass(LogModel);

LogSchema.pre('save', function () {
    this.set(this.isNew ? 'created' : 'updated', new Date());
});
