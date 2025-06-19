
import {floor} from '../util.js';

export * from '../util.js';


export type Kp = '0' | '0+' | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}${'' | '-' | '+'}` | '9-' | '9';

export function parseKp(kp: number | string): Kp {
    if (typeof kp === 'number') {
        let num = floor(kp);
        if (kp % 1 < 0.25) {
            return String(num) as Kp;
        } else if (kp % 1 < 0.5) {
            return String(num) + '+' as Kp;
        } else {
            return String(num + 1) + '-' as Kp;
        }
    } else {
        return (kp[0] + (kp[1] === 'P' ? '+' : (kp[1] === 'M' ? '-' : ''))) as Kp;
    }
}

export function parseText(data: string): string[][] {
    return data.split('\n').filter(x => !(x.startsWith('#') || x.startsWith(':'))).map(x => x.replaceAll(/ +/g, '').trim().split(' '));
}


// @ts-ignore
let schema = (typeof location === 'object' && typeof location.protocol === 'string') ? 'http://' : 'https://';

export async function api<T extends string>(url: T): Promise<T extends `${string}.json` ? any : string> {
    let start = schema;
    if (url.startsWith('/')) {
        start += 'services.swpc.noaa.gov';
    }
    let resp = await fetch(start + url);
    if (resp.ok) {
        if (url.endsWith('.json')) {
            // @ts-ignore
            return await resp.json();
        } else {
            return await resp.text();
        }
    } else {
        throw new Error(`${resp.status} ${resp.statusText} while fetching ${url}`);
    }
}