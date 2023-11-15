import { Module, Scope } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MapperModule } from './model/response/mapper.module';
import { ServiceModule } from './services/service.module';
import { DatabaseModule } from './model/database/database.module';
//.env config
import * as dotenv from 'dotenv';
import { AuthModule } from './application/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { PaginationModule } from './application/pagination/pagination.module';
import { CronModule } from './application/cron/cron.module';
import { MainAuthorizer } from './application/auth/guards/main-authorizer';
import { AuthorizerBase } from './application/auth/guards/abstract/authorizer-base';
import { JwtAuthGuard } from './application/auth/guards/jwt-auth.guard';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptor/response';
import { ExceptionInterceptor } from './common/interceptor/exception';
import { FileModule } from './api/file/file.module';
import { RequestModule } from './requests/request.module';
import { NestedUpdateModule } from './application/nested-update/nested-update.module';
import { MicroServiceModule } from './model/micro-service/micro-service.module';
import { LocationModule } from './api/location/location.module';

dotenv.config();
dotenv.config({ path: `src/common/config/.${process.env.NODE_ENV}.env` });

@Module({
    imports: [
        MongooseModule.forRoot(process.env.mongo_server, {
            poolSize: +process.env.pool_size,
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            ignoreUndefined: true,
            user: process.env.mongo_user,
            pass: process.env.mongo_pass,
            dbName: process.env.mongo_database,
            connectionName: process.env.mongo_main_db,
        }),
        MongooseModule.forRoot(process.env.mongo_server_log, {
            poolSize: +process.env.pool_size,
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            ignoreUndefined: true,
            user: process.env.mongo_user,
            pass: process.env.mongo_pass,
            dbName: process.env.mongo_database_log,
            connectionName: process.env.mongo_log_db,
        }),
        MongooseModule.forRoot(process.env.mongo_central, {
            poolSize: +process.env.pool_size,
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            ignoreUndefined: true,
            user: process.env.mongo_user,
            pass: process.env.mongo_pass,
            dbName: process.env.mongo_central_log,
            connectionName: process.env.mongo_central_db,
        }),
        ServiceModule,
        RequestModule,
        MapperModule,
        DatabaseModule,
        AuthModule,
        UserModule,
        PaginationModule,
        CronModule,
        FileModule,
        NestedUpdateModule,
        MicroServiceModule,
        LocationModule
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
            scope: Scope.REQUEST,
        },
        {
            provide: APP_FILTER,
            useClass: ExceptionInterceptor,
            scope: Scope.REQUEST,
        },
        //not found 404 => maybe you enter wrong route, above APP_FILTER don't get error
        //because of that we used same filter without scope request
        {
            provide: APP_FILTER,
            useClass: ExceptionInterceptor,
        },
        // make sure all APIs are only accessed by logged-in users
        // unless you specify otherwise, with {@link Public} decorator
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        // Application authorizer
        {
            provide: AuthorizerBase,
            useClass: MainAuthorizer,
        },
    ],
})
export class AppModule {}
