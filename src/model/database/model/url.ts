import { BaseModel } from './base/base';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleType } from '../../../common/types/role-type';
import mongoose, { Types } from 'mongoose';

export const UrlDB = 'Url';
@Schema({ versionKey: false, collection: 'url' })
export class UrlModel extends BaseModel {
    @Prop({ name: 'path', type: 'string', required: true })
    path: string;

    @Prop({ name: 'file_id', type: Types.ObjectId, required: false })
    fileId: Types.ObjectId;

    @Prop({ name: 'access', type: 'object', required: true })
    access: {
        role: RoleType;
        id: Types.ObjectId;
    };

    @Prop({ name: 'expiration_date', type: Date, required: true })
    expiration_date: Date;
}

export const UrlSchema: mongoose.Schema = SchemaFactory.createForClass(UrlModel);

UrlSchema.pre('save', function () {
    this.set(this.isNew ? 'created' : 'updated', new Date());
});
