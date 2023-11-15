import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../model/database/database.module';
import { LogDBService } from '../model/database/log-db.service';
import { LogDB, LogSchema } from '../model/database/model/log';
import { MapperModule } from '../model/response/mapper.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: LogDB, schema: LogSchema }], process.env.mongo_log_db), MapperModule, DatabaseModule],
    controllers: [],
    providers: [LogDBService],
    exports: [],
})
export class RequestModule {}
