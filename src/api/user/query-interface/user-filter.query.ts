import { QueryInterface } from '../../../common/pipes/interface/query';

export const ApiCustomerListCustomFieldFilterQuery: QueryInterface = {
    isComplete: {
        title: 'custom fields',
        type: 'boolean',
        schema: 'customer.customFields',
    },
    email: {
        title: 'email',
        type: 'string',
        schema: 'customer.email',
    },
    fullname: {
        title: 'fullname',
        type: 'string',
        schema: 'customer.fullname',
    },
    companyName: {
        title: 'companyName',
        type: 'string',
        schema: 'customer.companyName',
    },
};

export const ApiUserManagementListFilterQuery: QueryInterface = {
    email: {
        title: 'email',
        type: 'string',
        schema: 'email',
    },
    fullname: {
        title: 'fullname',
        type: 'string',
        schema: 'fullname',
    },
};

export const ApiCustomerListWizardFilterQuery: QueryInterface = {
    email: {
        title: 'email',
        type: 'string',
        schema: 'customer.email',
    },
    fullname: {
        title: 'fullname',
        type: 'string',
        schema: 'customer.fullname',
    },
    companyName: {
        title: 'companyName',
        type: 'string',
        schema: 'customer.companyName',
    },
};
