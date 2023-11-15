import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ServiceModule } from '../../services/service.module';
import { CronService } from './cron.service';
import { DatabaseModule } from '../../model/database/database.module';

@Module({
    imports: [ScheduleModule.forRoot(), ServiceModule, DatabaseModule],
    providers: [CronService],
})
export class CronModule {}
