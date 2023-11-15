import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ValidatorCheckInterface, ValidatorInterface } from './validator.interface';
import { ValidationType } from './validations/type';
import { ValidationString } from './validations/string';
import { ValidationArray } from './validations/array';
import { ValidatorMessage } from './validator.message';
import { Types } from 'mongoose';

@Injectable()
export class ValidatorPipe implements PipeTransform {
    private validationType = new ValidationType();
    private validationString = new ValidationString();
    private validationArray = new ValidationArray();
    private error: string[] = [];

    private static message(message: string, title: string, check?: string): string {
        const regexData = new RegExp('{{check}}', 'ig');
        message = message.replace(regexData, check ? check : '');

        const regexTitle = new RegExp('{{title}}', 'ig');
        return message.replace(regexTitle, title);
    }

    private type(validator: ValidatorInterface, value: any): boolean {
        if (!validator.required && value === null) return true;
        switch (validator.type) {
            case 'any':
                return Array.isArray(value) && validator.isArray || (!Array.isArray(value) && !validator.isArray);
            case 'number':
                if (validator.isArray) {
                    if (!this.validationType.isArray(value)) return false;
                    for (const valueElement of value) {
                        if (!this.validationType.isNumber(valueElement)) return false;
                    }
                    return true;
                }
                return this.validationType.isNumber(value);
            case 'boolean':
                if (validator.isArray) {
                    if (!this.validationType.isArray(value)) return false;
                    for (const valueElement of value) {
                        if (!this.validationType.isBoolean(valueElement)) return false;
                    }
                    return true;
                }
                return this.validationType.isBoolean(value);
            case 'date':
                if (validator.isArray) {
                    if (!this.validationType.isArray(value)) return false;
                    for (const valueElement of value) {
                        if (!this.validationString.isJsonDate(valueElement)) return false;
                    }
                    return true;
                }
                return this.validationString.isJsonDate(value);
            case 'object':
                if (validator.isArray) {
                    if (!this.validationType.isArray(value)) return false;
                    for (const valueElement of value) {
                        if (!this.validationType.isObject(valueElement)) return false;
                    }
                    return true;
                }
                return this.validationType.isObject(value);
            default:
                if (validator.isArray) {
                    if (!this.validationType.isArray(value)) return false;
                    for (const valueElement of value) {
                        if (!this.validationType.isString(valueElement)) return false;
                    }
                    return true;
                }
                return this.validationType.isString(value);
        }
    }

    private static getValue(values: { [key: string]: any }, key: string): any {
        if (!key.includes(':')) return values[key] === undefined ? undefined : values[key];

        const [parent, child] = key.split(':');
        return values[parent] !== undefined && values[parent][child] !== undefined ? values[parent][child] : undefined;
    }

    private static setValue(values: { [key: string]: any }, key: string, value: any): { [key: string]: any } {
        if (!key.includes(':')) values[key] = value;
        else {
            const [parent, child] = key.split(':');
            values[parent][child] = value;
        }

        return values;
    }

    transform(values: { [key: string]: any }, meta: ArgumentMetadata): { [key: string]: any } {
        this.error = [];
        const validators = Reflect.getMetadata('validator', meta.metatype);
        const validatorsArray = Reflect.getMetadata('validator-array', meta.metatype);

        if (validators) this.checkValidator(validators, values, false);
        if (validatorsArray) this.checkValidator(validatorsArray, values, true);

        if (this.error.length !== 0) throw new BadRequestException(this.error);

        return values;
    }

    private checkValidator(validators: any, values: { [key: string]: any }, isArray: boolean) {
        Object.keys(validators).forEach((key: string) => {
            const validator: ValidatorInterface = validators[key];
            const check: ValidatorCheckInterface = validator.check ? validator.check : {};
            const title: string = validator.title;

            if (isArray) {
                const [parent, child] = key.split(':');

                for (let i = 0; i < values[parent]?.length; i++) {
                    const value = ValidatorPipe.getValue(values[parent][i], child);
                    this.checkProps(value, validator, title + ` Num ${i + 1} `, values[parent][i], child, check);
                }
            } else {
                const value = ValidatorPipe.getValue(values, key);
                this.checkProps(value, validator, title, values, key, check);
            }
        });
    }

    private checkRelatedDependencies(values: any, conditions: Record<string, Record<'exists' | 'eq' | 'ne' | 'bt' | 'lt' | 'bte' | 'lte' | 'in' | 'nin', any>>): boolean {
        if (!conditions) return true;

        let required = true;
        for (const relationConditionKey in conditions) {
            if (!conditions.hasOwnProperty(relationConditionKey)) continue;
            const relatedValue = values[relationConditionKey];
            for (const relationConditionElementElement in conditions[relationConditionKey]) {
                if (!conditions[relationConditionKey].hasOwnProperty(relationConditionElementElement)) continue;
                switch (relationConditionElementElement) {
                    case 'exists':
                        required &&= conditions[relationConditionKey]['exists'] ? !!relatedValue: (relatedValue === undefined || relatedValue === null);
                        break;
                    case 'eq':
                        required &&= relatedValue === conditions[relationConditionKey][relationConditionElementElement];
                        break;
                    case 'ne':
                        required &&= relatedValue !== conditions[relationConditionKey][relationConditionElementElement];
                        break;
                    case 'bt':
                        required &&= relatedValue > conditions[relationConditionKey][relationConditionElementElement];
                        break;
                    case 'lt':
                        required &&= relatedValue < conditions[relationConditionKey][relationConditionElementElement];
                        break;
                    case 'bte':
                        required &&= relatedValue >= conditions[relationConditionKey][relationConditionElementElement];
                        break;
                    case 'lte':
                        required &&= relatedValue <= conditions[relationConditionKey][relationConditionElementElement];
                        break;
                    case 'in':
                        required &&= Array.isArray(conditions[relationConditionKey][relationConditionElementElement]) && conditions[relationConditionKey][relationConditionElementElement]?.indexOf(relatedValue) > -1;
                        break;
                    case 'nin':
                        required &&= Array.isArray(conditions[relationConditionKey][relationConditionElementElement]) && conditions[relationConditionKey][relationConditionElementElement]?.indexOf(relatedValue) === -1;
                        break;
                }
            }
        }
        return required;
    }

    private checkProps(
        value: any,
        validator: ValidatorInterface,
        title: string,
        values: { [key: string]: any },
        key: string,
        check: ValidatorCheckInterface
    ): number {
        validator.required &&= this.checkRelatedDependencies(values, validator.relationCondition);

        if (!validator.required && !value) return;

        if (value === undefined) return this.error.push(ValidatorPipe.message(ValidatorMessage.undefined, title));
        /******************** TYPE  ********************/
        // Check value type
        if (!this.type(validator, value)) return this.error.push(ValidatorPipe.message(ValidatorMessage.invalid, title));

        /**************** UPDATE VALUES ****************/
        // Remove white space from string values
        if (this.validationType.isString(value)) {
            value = value.trim();
            values = ValidatorPipe.setValue(values, key, value);
        }

        // Date Values
        if (validator.type === 'date' && value !== null) {
            value = new Date(value);
            values = ValidatorPipe.setValue(values, key, value);
        }

        /******************** EMPTY ********************/
            // Empty value (Required check)
        const empty: boolean = this.validationType.isEmpty(value);
        if (validator.required && empty) return this.error.push(ValidatorPipe.message(ValidatorMessage.empty, title));
        if (empty) return;

        /******************** CHECK ********************/
        // EMAIL
        if (check.email && !this.validationString.isEmail(value)) return this.error.push(ValidatorPipe.message(ValidatorMessage.email, title));

        // MOBILE
        if (check.mobile && !this.validationString.isMobile(value)) return this.error.push(ValidatorPipe.message(ValidatorMessage.invalid, title));

        // NATIONAL CODE
        if (check.nationalCode && !this.validationString.isNationalCode(value))
            return this.error.push(ValidatorPipe.message(ValidatorMessage.invalid, title));

        // BANK CARD
        if (check.bankCard && !this.validationString.isBankCard(value))
            return this.error.push(ValidatorPipe.message(ValidatorMessage.invalid, title));

        // OBJECT ID
        // if (check.objectId) {
        //     if (validator.isArray) {
        //         for (const valueElement of value) {
        //             if (!Types.ObjectId.isValid(valueElement)) return this.error.push(ValidatorPipe.message(ValidatorMessage.invalid, title));
        //         }
        //     } else if (!Types.ObjectId.isValid(value)) return this.error.push(ValidatorPipe.message(ValidatorMessage.invalid, title));
        // }
        if (check.objectId && !Types.ObjectId.isValid(value)) return this.error.push(ValidatorPipe.message(ValidatorMessage.invalid, title));

        // DOMAIN
        if (check.domain && !this.validationString.isDomain(value)) return this.error.push(ValidatorPipe.message(ValidatorMessage.invalid, title));

        // PATTERN
        if (check.pattern && !new RegExp(check.pattern).test(value.toString()))
            return this.error.push(ValidatorPipe.message(ValidatorMessage.invalid, title));

        // IN
        if (check.in && !check.in.includes(value)) return this.error.push(ValidatorPipe.message(ValidatorMessage.invalid, title));

        // MIN
        if ((check.min || check.min === 0) && value < check.min)
            return this.error.push(ValidatorPipe.message(ValidatorMessage.min, title, check.min.toString()));
        // MAX
        if ((check.max || check.min === 0) && value > check.max)
            return this.error.push(ValidatorPipe.message(ValidatorMessage.max, title, check.max.toString()));

        // LENGTH
        if (check.length && check.length.equal && value.length !== check.length.equal)
            return this.error.push(ValidatorPipe.message(ValidatorMessage.length, title, check.length.equal.toString()));
        // MIN LENGTH
        if (check.length && check.length.min && value.length < check.length.min)
            return this.error.push(ValidatorPipe.message(ValidatorMessage.minLength, title, check.length.min.toString()));
        // MAX LENGTH
        if (check.length && check.length.max && value.length > check.length.max)
            return this.error.push(ValidatorPipe.message(ValidatorMessage.maxLength, title, check.length.max.toString()));

        // ARRAY UNIQUE
        if (check.arrayUnique && !this.validationArray.isUnique(value))
            return this.error.push(ValidatorPipe.message(ValidatorMessage.arrayUnique, title));

        // ARRAY COUNT
        if (check.arrayCount && check.arrayCount.equal && value.length !== check.arrayCount.equal)
            return this.error.push(ValidatorPipe.message(ValidatorMessage.arrayCount, title, check.arrayCount.equal.toString()));
        // ARRAY MIN COUNT
        if (check.arrayCount && check.arrayCount.min && value.length < check.arrayCount.min)
            return this.error.push(ValidatorPipe.message(ValidatorMessage.arrayMinCount, title, check.arrayCount.min.toString()));
        // ARRAY MAX COUNT
        if (check.arrayCount && check.arrayCount.max && value.length < check.arrayCount.max)
            return this.error.push(ValidatorPipe.message(ValidatorMessage.arrayMaxCount, title, check.arrayCount.max.toString()));

        // ARRAY EXISTS
        if (check.arrayExists && !check.arrayExists.includes(value)) return this.error.push(ValidatorPipe.message(ValidatorMessage.invalid, title));

        // ARRAY IN
        if (check.arrayIn && !this.validationArray.in(check.arrayIn, value))
            return this.error.push(ValidatorPipe.message(ValidatorMessage.invalid, title));
    }
}
