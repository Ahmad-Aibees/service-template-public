export type ValidatorMessageType =
    | 'undefined'
    | 'invalid'
    | 'empty'
    | 'email'
    | 'mobile'
    | 'min'
    | 'max'
    | 'length'
    | 'minLength'
    | 'maxLength'
    | 'arrayUnique'
    | 'arrayCount'
    | 'arrayMinCount'
    | 'arrayMaxCount';

export const ValidatorMessage: { [key in ValidatorMessageType]: string } = {
    undefined: 'required_{{title}}',
    invalid: 'invalid_{{title}}',
    empty: 'required_{{title}}',
    email: 'invalid_email_{{title}}',
    mobile: 'invalid_mobile_{{title}}',

    min: "less_than_{{title}}_{{check}}",
    max: 'more_than_{{title}}_{{check}}.',

    length: 'length_equal_{{title}}_{{check}}',
    minLength: 'length_min_{{title}}_{{check}}',
    maxLength: 'length_max_{{title}}_{{check}}',

    arrayUnique: 'array_unique_{{title}}',
    arrayCount: 'array_length_{{title}}_{{check}}',
    arrayMinCount: 'array_min_length_{{title}}_{{check}}',
    arrayMaxCount: 'array_max_length_{{title}}_{{check}}',
};
