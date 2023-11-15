import { Schema, Prop, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import { ActionActorModel, ActionActorSchema } from '../weak/action-actor-model';

@Schema({ versionKey: false })
export class BaseModel extends mongoose.Document {
    @Prop()
    readonly _id: Types.ObjectId;

    @Prop()
    readonly created: Date;
    @Prop({
        required: false,
        type: ActionActorSchema
    })
    createdBy: ActionActorModel

    @Prop({ required: false })
    readonly updated: Date;

    @Prop({
        required: false,
        type: [ActionActorSchema]
    })
    updatedBy: ActionActorModel[];

    @Prop()
    readonly deactivated: boolean;

    @Prop()
    readonly deleted: boolean;
}
