import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from "mongoose";

@Schema({ versionKey: false, _id: false })
export class MultiTranslationLabel extends mongoose.Document {
    @Prop({ required: true, type: String })
    english: string;

    @Prop({ required: false, type: String })
    persian?: string;
}

export const MultiLanguageLabelSchema = SchemaFactory.createForClass(MultiTranslationLabel);
