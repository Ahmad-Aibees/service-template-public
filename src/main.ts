import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { initialize } from './init';
require('./common/plugins/mongoose.plugin');
import * as basicAuth from 'express-basic-auth';
import { SystemIntegrationDbService } from './model/database/system-integration-db.service';
import * as dotenv from "dotenv";
const beforeShutdown = require('./before-shutdown');
dotenv.config();
dotenv.config({ path: `src/common/config/.${process.env.NODE_ENV}.env` });

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    if (!!(+process.env.enable_swagger)) {
        app.use(['/docs', '/docs-json', '/swagger'], basicAuth({
            challenge: true,
            users: {
                [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
            },
        }));
        const options = new DocumentBuilder()
            .setTitle(process.env.server_name.toUpperCase() + '(' + process.env.NODE_ENV + ')')
            .setDescription('API')
            .setVersion('1')
            .addBearerAuth({ type: 'http', name: 'Authorization' })
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('swagger', app, document, {
            customCss: `body { counter-reset: endpoints; }
                .models { display: none !important; } 
                .opblock { position: relative; padding-left: 40px; } 
                .opblock:before { 
                    counter-increment: endpoints;
                    width: 35px;
                    text-align: right;
                    display: block; 
                    content: counter(endpoints); 
                    position: absolute; 
                    left: 1px; 
                    top: 11px;
                    font-family: monospace;
                    font-weight: 700;
                    font-size: 14px;
                }`,

            customSiteTitle: process.env.server_name.toUpperCase(),
        });
    }
    beforeShutdown(() => app.get(SystemIntegrationDbService).exitService());

    initialize(app);
    await app.listen(process.env.port);
}
bootstrap().then(() => console.log('service is running on port ' + process.env.port));
