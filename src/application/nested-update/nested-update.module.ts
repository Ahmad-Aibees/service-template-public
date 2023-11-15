import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NestedUpdateService } from './nested-update.service';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
            ],
            process.env.mongo_main_db,
        ),
    ],
    providers: [NestedUpdateService],
    exports: [NestedUpdateService],
})
export class NestedUpdateModule {}
