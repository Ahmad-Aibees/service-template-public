import { QueryInterface } from '../../../common/pipes/interface/query';

export const ApiCustomerListCustomFieldSortQuery: QueryInterface = {
    fullname: {
        title: 'fullname',
        type: 'string',
        schema: 'customer.fullname',
        sort: true,
    },
};

// export const ApiUserManagementListSortQuery: QueryInterface = {
//     email: {
//         title: 'email',
//         type: 'string',
//         schema: 'email',
//     },
//     fullname: {
//         title: 'fullname',
//         type: 'string',
//         schema: 'fullname',
//     },
// };

export const ApiCustomerListWizardSortQuery: QueryInterface = {
    fullname: {
        title: 'fullname',
        type: 'string',
        schema: 'customer.fullname',
        sort: true,
    },
    email: {
        title: 'email',
        type: 'string',
        schema: 'customer.email',
        sort: true,
    },
    companyName: {
        title: 'companyName',
        type: 'string',
        schema: 'customer.companyName',
        sort: true,
    },
};
