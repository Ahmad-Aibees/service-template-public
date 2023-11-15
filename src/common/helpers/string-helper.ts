export class StringHelper {
    public static removePrefix(str: string, prefix: string): string {
        if (!str || !prefix || prefix.length > str.length) {
            return str;
        }
        return str.startsWith(prefix) ? str.substr(prefix.length) : str;
    }

    public static ensurePrefix(str: string, prefix: string): string {
        return `${prefix}${this.removePrefix(str, prefix)}`;
    }

    public static removeSuffix(str: string, suffix: string): string {
        if (!str || !suffix || suffix.length > str.length) {
            return str;
        }
        return str.endsWith(suffix) ? str.substr(0, str.length - suffix.length) : str;
    }

    public static ensureSuffix(str: string, suffix: string): string {
        return `${this.removeSuffix(str, suffix)}${suffix}`;
    }

    public static splitByN(str: string, N: number): string[] {
        return str.match(new RegExp(`.{${N}}`, 'g'));
    }

    public static replaceAll(str: string, find: string, replace: string): string {
        function escapeRegExp(string) {
            return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        }

        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    public static parseNumber(str: string, defaultValue: number, writeWarn: boolean): number {
        try {
            return parseInt(str);
        } catch (error) {
            if (writeWarn) {
                console.warn(error);
            }
            return defaultValue;
        }
    }

    public static parseBoolean(str: string, defaultValue: boolean, writeWarn: boolean): boolean {
        try {
            const v = str;
            if (!v) {
                return defaultValue;
            }
            return v.toLowerCase() === 'true';
        } catch (error) {
            if (writeWarn) {
                console.warn(error);
            }
            return defaultValue;
        }
    }

    //wwwwwwwww. www. w. w ww remove start of string
    public static removeWFromDomain(str: string): string {
        return str.replace(/^(w)*\./g, '');
    }

    public static convertStringToObject(str: string): any {
        try {
            return JSON.parse(str);
        } catch (e) {
            return {};
        }
    }
}
