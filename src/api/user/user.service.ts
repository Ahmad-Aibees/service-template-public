import {
    Injectable,
} from '@nestjs/common';
import { PaginationService } from '../../application/pagination/pagination.service';
import { AuthMsService } from '../../model/micro-service/auth-ms.service';
import { ApiUserLoginRq, ApiUserLoginRs } from './rq-rs/login';
import { isError } from '@nestjs/cli/lib/utils/is-error';
import {Request} from "express";
import {Identity} from "../../application/auth/models/identity";
import {NotificationMsService} from "../../model/micro-service/notification-ms.service";
import {ApiUserChangePasswordRq} from "./rq-rs/change-password";

@Injectable()
export class UserService {
    constructor(
        private readonly paginationService: PaginationService, // private readonly notificationService: NotificationService,
        private readonly authMsService: AuthMsService,
        private readonly notificationMsService: NotificationMsService
    ) {
    }

    async login(body: ApiUserLoginRq, req: Request): Promise<ApiUserLoginRs> {
        const authResponse = await this.authMsService.loginByUsername(body.username, body.password, req);

        if (isError(authResponse))
            throw authResponse;

        return {
            token: authResponse.token,
            refreshToken: authResponse.refreshToken,
            user: authResponse.user
        }
    }

    async getForgetPasswordToken(email: string, identity: Identity, req: Request): Promise<void> {
        const results = await this.authMsService.getForgetPasswordToken(email, identity, req);

        await this.notificationMsService.sendVerificationCode(results.code, results.mobile, identity.clientId, req);

        return;
    }

    async resetPassword(body: ApiUserChangePasswordRq, req: Request):Promise<void> {
        return this.authMsService.changePasswordByToken(body, req);
    }
}
