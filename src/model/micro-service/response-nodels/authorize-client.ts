import {Types} from "mongoose";

export class AuthorizeClient {
    clientId: Types.ObjectId;
    englishName: string;
    persianName: string;
    integrationKey: string;
    enabledProducts: { id: string, name: string }[];

    constructor(result: Record<string, any>) {
        this.clientId = result.clientId ? Types.ObjectId.createFromHexString(result.clientId): undefined;
        this.englishName = result.englishName;
        this.persianName = result.persianName;
        this.integrationKey = result.integrationKey;
        this.enabledProducts = result.enabledProducts;
    }
}
