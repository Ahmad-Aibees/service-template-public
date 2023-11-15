import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '../../../common/types/role-type';
import { IS_PUBLIC } from '../decorator/meta-data/is-public';
import { ROLE } from '../decorator/meta-data/needs-permission';
import { Identity } from '../models/identity';
import { AuthorizerBase } from './abstract/authorizer-base';
import { productType } from '../../../common/types/product.type';
import { PRODUCT } from '../decorator/meta-data/target-product';

@Injectable()
export class MainAuthorizer extends AuthorizerBase {
    constructor() {
        super();
    }

    private static reflect<T>(context: ExecutionContext, reflector: Reflector, metaKey: string): T {
        return reflector.getAllAndOverride<T>(metaKey, [context.getHandler(), context.getClass()]);
    }

    // forbidden() {
    //     throw new ForbiddenException("You don't have access.");
    // }

    async canAccess(context: ExecutionContext, reflector: Reflector): Promise<boolean> {
        const { identity } = this.getContextData(context);

        //IS PUBLIC .....................
        const isApiPublic = MainAuthorizer.reflect<boolean>(context, reflector, IS_PUBLIC);
        if (isApiPublic) {
            return true;
        }

        // all Apis need to login expect is public Apis ........
        if (!identity || identity.isAuthenticated === false) {
            throw new UnauthorizedException("You're not login!");
        }

        // NEEDS PERMISSION .................
        const config = MainAuthorizer.reflect<RoleType[]>(context, reflector, ROLE);
        if (config) {
            if (!config.includes(identity.actorType)) return false;
        }

        const product = MainAuthorizer.reflect<productType>(context, reflector, PRODUCT);
        if (product) {
            if (!identity.enabledProducts.map(p => p.name).includes(product)) return false;
        }

        return true;
    }

    // noinspection JSMethodCanBeStatic
    private getContextData(context: ExecutionContext): { identity: Identity; request: any } {
        const request = context.switchToHttp().getRequest();
        return {
            identity: request['identity'] as Identity,
            request: request,
        };
    }
}
