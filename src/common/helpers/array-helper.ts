export class ArrayHelper {
    static async mapAsync<T, R>(array: T[], callbackfn: (value: T, index: number, array: T[]) => Promise<R>)
        : Promise<R[]> {
        const res: R[] = [];
        if (array === null || array === undefined) {
            return res;
        }
        for (let i = 0; i < array.length; i++) {
            const x = array[i];
            const r = await callbackfn(x, i, array);
            res.push(r);
        }
        return res;
    }
}