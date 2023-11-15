import { Controller } from '@nestjs/common';
import { IsPublic } from '../application/auth/decorator/meta-data/is-public';

//TODO THIS CLASS IS JUST FOR TEST
@Controller('services')
@IsPublic()
export class ServicesController {
    constructor(
    ) {}
}
