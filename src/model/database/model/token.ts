import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BaseModel } from './base/base';
import {Types} from "mongoose";
export const TokenDB = 'Token';

@Schema({ versionKey: false, collection: 'Token', timestamps: true })
export class TokenModel extends BaseModel {
    @Prop({ required: true, type: Types.ObjectId })
    user: Types.ObjectId;

    @Prop({ required: false, type: String })
    value: string;

    @Prop({ required: false, type: String })
    type: string;

    @Prop({ required: false, type: Date, expires: 0 })
    expiresAt: Date;
}

export const TokenSchema: mongoose.Schema = SchemaFactory.createForClass(TokenModel);
