import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ActivityLogMsService } from './activity-log-ms.service';
import { AuthMsService } from './auth-ms.service';
import { MicroServiceService } from './micro-service.service';
import { NotificationMsService } from './notification-ms.service';
import { FileMsService } from './file-ms.service';
import { LocationMsService } from './location-ms.service';

@Module({
    imports: [DatabaseModule],
    providers: [MicroServiceService, ActivityLogMsService, AuthMsService, NotificationMsService, FileMsService, LocationMsService],
    exports: [ActivityLogMsService, AuthMsService, NotificationMsService, MicroServiceService, FileMsService, LocationMsService]
})
export class MicroServiceModule {}
