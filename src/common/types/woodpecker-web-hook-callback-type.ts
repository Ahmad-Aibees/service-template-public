export type woodpeckerWebHookCallbackType =
    'prospect_replied'
    | 'link_clicked'
    | 'email_opened'
    | 'prospect_bounced'
    | 'prospect_invalid'
    | 'prospect_interested'
    | 'prospect_maybe_later'
    | 'prospect_not_nterested'
    | 'prospect_autoreplied'
    | 'followup_after_autoreply'
    | 'campaign_sent'
    | 'prospect_blacklisted';

export const woodpeckerWebHookCallbackTypeList = [
    'prospect_replied',
    'link_clicked',
    'email_opened',
    'prospect_bounced',
    'prospect_invalid',
    'prospect_interested',
    'prospect_maybe_later',
    'prospect_not_nterested',
    'prospect_autoreplied',
    'followup_after_autoreply',
    'campaign_sent',
    'prospect_blacklisted',
];
