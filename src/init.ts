import { NestExpressApplication } from '@nestjs/platform-express';
import { getJwtMiddleware } from './application/auth/middlewares/jwt-middleware';
import { AuthMsService } from './model/micro-service/auth-ms.service';
import { SystemIntegrationDbService } from './model/database/system-integration-db.service';
import { ActivityLogMsService } from './model/micro-service/activity-log-ms.service';

export function initialize(app: NestExpressApplication): void {
    app.enableCors({
        origin: '*',
        methods: 'POST,GET,PATCH,DELETE,PUT',
        credentials: true,
    });

    app.use(getJwtMiddleware(app.get(AuthMsService), app.get(ActivityLogMsService)));

    const systemIntegrationDbService = app.get(SystemIntegrationDbService);

    systemIntegrationDbService.registerService().then();
}
