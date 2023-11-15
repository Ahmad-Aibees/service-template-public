export interface ValidatorCheckInterface {
    email?: boolean;
    mobile?: boolean;
    nationalCode?: boolean;
    bankCard?: boolean;
    objectId?: boolean;
    domain?: boolean;
    smartsheetLink?: boolean;
    pattern?: RegExp;
    in?: any[];

    min?: number;
    max?: number;

    length?: {
        equal?: number;
        min?: number;
        max?: number;
    };

    arrayUnique?: boolean;
    arrayCount?: {
        equal?: number;
        min?: number;
        max?: number;
    };
    arrayExists?: string[];
    arrayIn?: any[];
}

export interface ValidatorInterface {
    title: string;
    // query = 'exists' | 'eq' | 'ne' | 'bt' | 'lt' | 'bte' | 'lte' | 'in' | 'nin'
    relationCondition?: Record<string, Record<string, any>>
    type?: 'any' | 'number' | 'boolean' | 'date' | 'object' | 'string[]';
    isArray?: boolean;
    required?: boolean;
    check?: ValidatorCheckInterface;
}
