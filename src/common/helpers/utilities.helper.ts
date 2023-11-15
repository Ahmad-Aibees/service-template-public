import * as moment from 'moment';
// import { isDeepStrictEqual } from 'util';

export const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

export const hasNullOrUndefined = (obj) => {
    for (const prop in obj) {
        if (obj[prop] === null || obj[prop] === undefined) return true;
    }
    return false;
};

export const getUTCDateSubstractedBy = (numOfDays) => moment().utc().subtract(numOfDays, 'days').startOf('day').toDate();

export const getUTCToday = () => moment.utc().toDate();

export const flattenArrays = (arrays: any[]) => [].concat.apply([], arrays);

export const getUTCUnixTimeStamp = () => moment().utc().unix();

export const convertToV2ApiToken = (api_token) => 'Basic ' + Buffer.from('aaa:' + String(api_token)).toString('base64');

export const distinctArrayFilter = (v, i, a) => {
    const _v = JSON.stringify(v);
    return (
        i ===
        a.findIndex((obj) => {
            return JSON.stringify(obj) === _v;
        })
    );
};

export const filterData = (data: any[]): any[] => {
    return data.filter((object) => !hasNullOrUndefined(object)).filter((object) => !!object);
};
