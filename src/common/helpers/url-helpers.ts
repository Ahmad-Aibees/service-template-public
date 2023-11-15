export class UrlHelpers {
    static createUrl(url: string, params?: any, query?: any): string {
        if (params)
            for (const paramsKey in params) {
                if (!params.hasOwnProperty(paramsKey)) continue;
                url = url.replace(`:${paramsKey}`, params[paramsKey]);
            }
        if (query) {
            if (url.indexOf('?') === -1)
                url += '?';
            else url += '&';
            const queryString = new URLSearchParams();
            for (const queryKey in query) {
                if (!query.hasOwnProperty(queryKey)) continue;
                queryString.append(queryKey, typeof query[queryKey] === 'object' ? JSON.stringify(query[queryKey]) : query[queryKey]);
            }
            url += queryString;
        }
        return url;
    }
}
