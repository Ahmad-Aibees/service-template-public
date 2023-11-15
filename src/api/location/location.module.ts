import {Module} from "@nestjs/common";
import {DatabaseModule} from "../../model/database/database.module";
import {LocationService} from "./location.service";
import {MicroServiceModule} from "../../model/micro-service/micro-service.module";
import {LocationController} from "./location.controller";

@Module({
    imports: [DatabaseModule, MicroServiceModule],
    controllers: [LocationController],
    providers: [LocationService]
})
export class LocationModule {}
