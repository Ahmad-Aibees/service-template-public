import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BaseModel } from './base/base';

export const EnvironmentLogDB = 'EnvironmentLog';

@Schema({ versionKey: false, collection: 'environment-log' })
export class EnvironmentLogModel extends BaseModel {
    @Prop({ required: true, type: Object })
    environment: any;
}

export const EnvironmentLogSchema: mongoose.Schema = SchemaFactory.createForClass(EnvironmentLogModel);

EnvironmentLogSchema.pre('save', function () {
    this.set(this.isNew ? 'created' : 'updated', new Date());
});
