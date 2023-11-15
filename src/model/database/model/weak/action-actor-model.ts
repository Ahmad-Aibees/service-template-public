import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false, _id: false })
export class ActionActorModel extends mongoose.Document {
    @Prop({ required: true, type: Types.ObjectId })
    actorId: Types.ObjectId;

    @Prop({ required: true, type: Date })
    date: Date;
}

export const ActionActorSchema = SchemaFactory.createForClass(ActionActorModel);
