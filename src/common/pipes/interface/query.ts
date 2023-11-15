export type QueryFieldTypes = 'ID' | 'string' | 'number' | 'date' | 'boolean' | 'status';
export type QueryOperatorsTypes = 'EQ' | 'NE' | 'IN' | 'SC' | 'AF' | 'BF' | 'GT' | 'GE' | 'LT' | 'LE' | 'EX' | 'EM';

export interface QueryFieldInterface {
    title: string;
    type: QueryFieldTypes;
    schema: string;
    sort?: boolean;
}

export interface QueryInterface {
    [key: string]: QueryFieldInterface;
}

export const QueryOperators: { [key in QueryOperatorsTypes]: QueryFieldTypes[] } = {
    EQ: ['ID', 'string', 'number', 'status', 'boolean'], //equal
    NE: ['ID', 'string', 'number'], // not equal
    IN: ['ID', 'string', 'number'], // in
    SC: ['string'], //search in text
    AF: ['date'], // after
    BF: ['date'], // before
    GT: ['number'], // great
    GE: ['number'], // greeter than equal
    LT: ['number'], // less than
    LE: ['number'], // less than equal
    EX: ['boolean'], //exist
    EM: ['string'], // elemMatch
};
