import { createParamDecorator } from '@nestjs/common';
import { multipart } from './utility/multi-part';

export const BodyMultipart = createParamDecorator(multipart.data.bind(multipart));