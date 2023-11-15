import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { EncryptionHelper } from '../../common/helpers/encryption-helper';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    verifyJwtToken(token: string): { userId: Types.ObjectId; clientId: Types.ObjectId, role: string } | null {
        let userId: Types.ObjectId = null;
        let clientId: Types.ObjectId = null;
        let role: string = null;

        try {
            // decrypt
            token = EncryptionHelper.decrypt(token);
            const payload = this.jwtService.verify(token, {
                ignoreExpiration: false,
                issuer: process.env.auth_jwt_issuer,
                secret: process.env.auth_jwt_secret,
            });
            userId = new Types.ObjectId(payload.userId);
            clientId = new Types.ObjectId(payload.clientId);
            role = payload.role;
        } catch (e) {}

        return {
            userId: userId ? userId : null,
            clientId: clientId ? clientId : null,
            role: role ? role : null,
        };
    }

    generateJwtToken(userId: Types.ObjectId, role: string, clientId?: Types.ObjectId): string {
        const o = {
            secret: process.env.auth_jwt_secret,
            expiresIn: process.env.token_expire,
            issuer: process.env.auth_jwt_issuer,
            subject: userId.toHexString(),
        };
        const token = this.jwtService.sign(
            {
                userId,
                role,
                clientId,
            },
            o,
        );

        // encrypt
        return EncryptionHelper.encrypt(token);
    }
}
