import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FileDB, FileSchema } from '../../model/database/model/file';
import { DatabaseModule } from '../../model/database/database.module';
import {MicroServiceModule} from "../../model/micro-service/micro-service.module";

@Module({
    imports: [
        MicroServiceModule,
        DatabaseModule
    ],
    controllers: [FileController],
    providers: [FileService],
    exports: [FileService],
})
export class FileModule {
}
