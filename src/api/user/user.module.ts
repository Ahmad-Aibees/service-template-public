import { Module } from '@nestjs/common';
import { AuthModule } from '../../application/auth/auth.module';
import { PaginationModule } from '../../application/pagination/pagination.module';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../../model/database/database.module';
import { MicroServiceModule } from '../../model/micro-service/micro-service.module';

@Module({
    imports: [
        PaginationModule,
        AuthModule,
        DatabaseModule,
        MicroServiceModule
    ],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
