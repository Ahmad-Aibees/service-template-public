import { RandomKeyHelper } from '../../../common/helpers/random-key-helper';
import { Identity } from '../models/identity';
import { AuthMsService } from '../../../model/micro-service/auth-ms.service';
import { ActivityLogMsService } from '../../../model/micro-service/activity-log-ms.service';

class JwtMiddleware {
    private headerPrefix = 'Bearer ';

    constructor(
        private readonly authMsService: AuthMsService,
        private readonly activityLogMsService: ActivityLogMsService,
    ) {
    }

    public async run(req, res, next) {
        try {
            req['id'] = RandomKeyHelper.create(24, RandomKeyHelper.alphaNumeric);
            req['activityLog'] = await this.activityLogMsService.initializeLog(req);

            const token = this.extractToken(req);

            req['identity'] = new Identity();

            if (token) {
                req.identity = await this.authMsService.verifyToken(token, req);
            } else {
                const client = await this.authMsService.verifyClientByLocation(req);
                req.identity = {
                    clientId: client.clientId,
                    enabledProducts: client.enabledProducts
                }
            }
            next();
        } catch (e) {
            console.log(e);
            next();
        }
    }

    private extractToken(req): string {
        return req.headers['authorization']?.substr(this.headerPrefix.length) ?? null;
    }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function getJwtMiddleware(authMsService: AuthMsService, activityLogMsService: ActivityLogMsService): Function {
    const e = new JwtMiddleware(authMsService, activityLogMsService);
    return e.run.bind(e);
}
