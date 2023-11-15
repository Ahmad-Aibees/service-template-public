import { ExecutionContext } from '@nestjs/common';
import * as _ from 'lodash';
import { StringHelper } from '../../../helpers/string-helper';
import { multipart } from './multi-part';

export async function bindMultipartClass(type: any, fields: string[], ctx: ExecutionContext) {
    const incorrect = new type();
    await multipart.multiple_data_typed(incorrect, fields, ctx);
    // now make property types correct
    const result = _.mergeWith(new type(), incorrect, (objValue, srcValue, key, object, source, stack) => {
        if (_.isArray(objValue)) {
            return srcValue;
        }
        if (_.isObject(objValue)) {
            return srcValue;
        }
        if (_.isNumber(objValue)) {
            return StringHelper.parseNumber(srcValue, objValue, false);
        }
        if (_.isBoolean(objValue)) {
            return StringHelper.parseBoolean(srcValue, objValue, false);
        }
    });
    return result;
}