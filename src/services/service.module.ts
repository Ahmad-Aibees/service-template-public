import { Module } from '@nestjs/common';
import { RequestModule } from '../requests/request.module';
import { ServicesController } from './services.controller';
import { DatabaseModule } from '../model/database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MapperModule } from '../model/response/mapper.module';

@Module({
    imports: [
        RequestModule,
        DatabaseModule,
        MapperModule,
    ],
    controllers: [ServicesController],
    providers: [],
    exports: [],
})
export class ServiceModule {}
