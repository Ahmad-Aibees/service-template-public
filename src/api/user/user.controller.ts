import {
    Body,
    Controller,
    Param,
    Post, Put,
    Req,
} from '@nestjs/common';
import { ApiBody, ApiDefaultResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ValidatorPipe } from '../../common/validator/interface/validator.pipe';
import { UserService } from './user.service';

import * as dotenv from 'dotenv';
import { ApiUserLoginRq, ApiUserLoginRs } from './rq-rs/login';
import { IsPublic } from '../../application/auth/decorator/meta-data/is-public';
import {Request} from "express";
import {CurrentIdentity} from "../../application/auth/decorator/current-user";
import {Identity} from "../../application/auth/models/identity";
import {ApiUserChangePasswordRq} from "./rq-rs/change-password";
dotenv.config();

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'login' })
    @ApiBody({ type: ApiUserLoginRq })
    @ApiDefaultResponse({ type: ApiUserLoginRs })
    @IsPublic()
    @Post('login')
    async login(@Body(ValidatorPipe) body: ApiUserLoginRq, @Req() req): Promise<ApiUserLoginRs> {
        return this.userService.login(body, req);
    }

    @ApiOperation({ summary: 'get forget password token' })
    @ApiParam({ name: 'email', required: true, type: String })
    @ApiDefaultResponse({ status: 200 })
    @IsPublic()
    @Put(':email')
    async getForgetPasswordToken(
        @Param('email') email: string,
        @CurrentIdentity() identity: Identity,
        @Req() req: Request
    ): Promise<void> {
        return this.userService.getForgetPasswordToken(email, identity, req);
    }

    @ApiOperation({ summary: 'change password' })
    @ApiBody({ type: ApiUserChangePasswordRq })
    @ApiDefaultResponse({ status: 200 })
    @IsPublic()
    @Put(':email')
    async changePassword(
        @Body(ValidatorPipe) body: ApiUserChangePasswordRq,
        @Req() req: Request
    ): Promise<void> {
        return this.userService.resetPassword(body, req);
    }
}
