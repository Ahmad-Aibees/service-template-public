import {SetMetadata} from "@nestjs/common";
import {productType} from "../../../../common/types/product.type";

export const PRODUCT = 'product';
/**
 * Marks the API to need some kind of permissions
 * @constructor
 * @param options
 */
export const Product = (options: productType) => SetMetadata(PRODUCT, options ?? undefined);
