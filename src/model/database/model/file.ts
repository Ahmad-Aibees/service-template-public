import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BaseModel } from './base/base';
import { FileType, FileTypesList } from '../../../common/types/file-type';

export const FileDB = 'File';

@Schema({ versionKey: false , collection: 'file' })
export class FileModel extends BaseModel {
    @Prop({ required: true, type: String, enum: FileTypesList })
    fileType: FileType;

    @Prop({ required: true, type: String })
    path: string;

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, type: String })
    size: string;
}

export const FileSchema: mongoose.Schema = SchemaFactory.createForClass(FileModel);

FileSchema.pre('save', function () {
    this.set(this.isNew ? 'created' : 'updated', new Date());
});
