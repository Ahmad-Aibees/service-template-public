import * as _ from 'lodash';
import { StringHelper } from '../../../helpers/string-helper';

export class FormDataParser {
    private static normalizeKey(key: string): string {
        return StringHelper.replaceAll(StringHelper.replaceAll(key, ']', ''), '[', '/');
    }

    private static isArrayBasedOnChildren(children: Item[], depth: number): boolean {
        const keys = children.map((a) => a.myKey(depth));
        try {
            for (let i = 0; i < keys.length; i++) {
                const idx = parseInt(keys[i]);
                if (isNaN(idx)) {
                    return false;
                }
            }
            return true;
        } catch (e) {
            // ignore
        }
        return false;
    }

    private static R(parent: {[key: string]: any} | [], depth: number, parentKey: string, key: string, items: Item[]) {
        const uniqueKey = _.isEmpty(parentKey) ? key : `${parentKey}/${key}`;
        // find children
        const children = items.filter((i) => i.isChildOf(uniqueKey, depth));
        // if there's no children then set value
        if (children.length == 0) {
            const item = items.find((a) => a.key === uniqueKey);
            parent[key] = item.value;
            return;
        }
        // care for empty children keys
        for (let i = 0; i < children.length; i++) {
            const ch = children[i];
            if (_.isEmpty(ch.myKey(depth + 1))) {
                ch.setMyKey(depth + 1, i.toString());
            }
        }
        // parent[key] is array or object?
        if (FormDataParser.isArrayBasedOnChildren(children, depth + 1)) {
            parent[key] = [];
        } else {
            parent[key] = {};
        }
        // do children
        for (let i = 0; i < children.length; i++) {
            const ch = children[i];
            FormDataParser.R(parent[key], depth + 1, uniqueKey, ch.myKey(depth + 1), items);
        }
    }

    public parse(fields: {[key: string]: any}): {[key: string]: any} {
        if (_.isEmpty(fields)) {
            return fields;
        }
        const items = Object.keys(fields).map((k) => {
            const item = new Item();
            item.key = FormDataParser.normalizeKey(k);
            item.value = fields[k];
            return item;
        });
        const firstLevelKeys = _.uniq(items.map((a) => a.key.split('/')[0]));
        const res = {};
        firstLevelKeys.forEach((rootKey) => {
            FormDataParser.R(res, 0, null, rootKey, items);
        });
        return res;
    }
}

class Item {
    key: string;
    value: {[key: string]: any};

    keyParts(): string[] {
        return this.key.split('/');
    }

    myKey(depth: number): string {
        return this.keyParts()[depth];
    }

    setMyKey(depth: number, key: string): string {
        const arr = this.keyParts();
        arr[depth] = key;
        this.key = arr.join('/');
        return this.key;
    }

    isChildOf(parentKey: string, parentDepth: number): boolean {
        const keyParts = this.keyParts();
        const depth = keyParts.length - 1;
        if (depth <= parentDepth) {
            return false;
        }
        const parentKeyParts = parentKey.split('/');
        for (let i = 0; i < parentKeyParts.length; i++) {
            if (keyParts[i] !== parentKeyParts[i]) {
                return false;
            }
        }
        return true;
    }
}
