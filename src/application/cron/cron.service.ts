import { Injectable } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { SystemIntegrationDbService } from '../../model/database/system-integration-db.service';

@Injectable()
export class CronService {
    constructor(private readonly systemIntegrationDbService: SystemIntegrationDbService) {}

    @Cron('1 * * * * *')
    async checkIn(): Promise<void> {
        await this.systemIntegrationDbService.registerService();
    }
}
