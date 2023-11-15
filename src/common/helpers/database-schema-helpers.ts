import mongoose from "mongoose";

export class DatabaseSchemaHelper {
    static add(destinationSchema: mongoose.Schema, addFields: any): mongoose.Schema {
        if (addFields) {
            destinationSchema.add(addFields);
        }

        return destinationSchema;
    }
}
