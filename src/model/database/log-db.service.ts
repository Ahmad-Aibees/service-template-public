import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogDB, LogModel } from './model/log';
const fs = require('fs');

@Injectable()
export class LogDBService {
    constructor(@InjectModel(LogDB) private readonly logModel: Model<LogModel>) {}

    async insert(log: LogModel): Promise<void> {
        try {
            await this.logModel.create(log);
        } catch (e) {
            //console.log(e);
        }
        LogDBService.writeLog(JSON.stringify(log));
    }

    private static writeLog(text: string) {
        if (fs.existsSync('app.log') === false) {
            // write to a new file named log.json
            fs.writeFile('app.log', text, (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;
            });
        } else {
            fs.appendFile('app.log', '\n' + text, (err) => {
                if (err) throw err;
            });
        }
    }
}
