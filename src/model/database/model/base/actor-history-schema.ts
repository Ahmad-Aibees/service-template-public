import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ActionActorModel, ActionActorSchema } from '../weak/action-actor-model';


@Schema({ versionKey: false })
export class ActorHistoryModel extends mongoose.Document {
    @Prop({ required: true, type: ActionActorSchema })
    createdBy: ActionActorModel;

    @Prop({ required: false, type: [ActionActorSchema] })
    updatedBy: ActionActorModel[];
}

export const ActorHistorySchema = SchemaFactory.createForClass(ActorHistoryModel);
