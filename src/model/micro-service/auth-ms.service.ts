import {Injectable, NotFoundException} from '@nestjs/common';
import { MicroServiceService } from './micro-service.service';
import { LoginResponse } from './response-nodels/login.response';
import { Types } from 'mongoose';
import { isError } from '@nestjs/cli/lib/utils/is-error';
import { ProfileResponse } from './response-nodels/profile.response';
import { AuthorizeClient } from './response-nodels/authorize-client';
import {Request} from "express";
import {Identity} from "../../application/auth/models/identity";
import {RoleTypesList} from "../../common/types/role-type";
import * as moment from 'moment';
import {ApiUserChangePasswordRq} from "../../api/user/rq-rs/change-password";

@Injectable()
export class AuthMsService extends MicroServiceService {
    async loginByMobile(mobile: string, clientId: Types.ObjectId): Promise<LoginResponse> {
        const result = await this.request('auth-service', '/auth/login-user', 'POST',
            {
                mobile,
                clientId: clientId.toHexString()
            },
        );

        if (isError(result)) throw result;
        return new LoginResponse(result);
    }

    async loginByUsername(username: string, password: string, req: Request): Promise<LoginResponse> {
        const result = await this.request('auth-service', '/auth/login-username-password', 'POST',
            {
                username,
                password,
                origin: req.headers.origin,
                ip: req.ip
            }, undefined, undefined, undefined, req
        );

        if (isError(result)) throw result;

        if (!RoleTypesList.includes(result.user.role))
            throw new NotFoundException('mot_found_user');
        return new LoginResponse(result);
    }

    async verifyToken(token: string, req: Request): Promise<ProfileResponse> {
        const result = await this.request('auth-service', '/auth/:token', 'POST', null, { token }, undefined, undefined, req);

        if (isError(result)) throw result;
        if (!RoleTypesList.includes(result.profile.role))
            throw new NotFoundException('mot_found_user');
        return new ProfileResponse(result);
    }

    async verifyClientByLocation(req: Request): Promise<AuthorizeClient> {
        const result = await this.request('auth-service', '/client/auth/by-domain', 'POST', {
            domain: req.headers.origin,
            ip: req.ip
        }, undefined, undefined, undefined, req);

        if (isError(result)) throw result;
        return new AuthorizeClient(result);
    }

    async getForgetPasswordToken(email: string, identity: Identity, req: Request): Promise<{ code: string, mobile: string, expirationDate: Date }> {
        const result = await this.request('auth-service', '/user/forget-password', 'POST', {
            clientId: identity.clientId?.toHexString(),
            userEmail: email
        }, undefined, undefined, undefined, req);

        if (isError(result))
            throw result;

        return {
            code: result.code,
            expirationDate: moment(result.expirationDate).toDate(),
            mobile: result.mobile
        }
    }

    async changePasswordByToken(body: ApiUserChangePasswordRq, req: Request): Promise<void> {
        const result = await this.request('auth-service', '/auth/change-password/:token', 'PATCH', body, {
            token: body.token
        }, undefined, undefined, req);

        if (isError(result))
            throw result;

        return;
    }
}
