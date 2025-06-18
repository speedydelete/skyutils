
import {floor, parseTime} from './util.js';


export type Kp = '0' | '0+' | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}${'' | '-' | '+'}` | '9-' | '9';

function parseKp(kp: number | string): Kp {
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


// @ts-ignore
let schema = (typeof location === 'object' && typeof location.protocol === 'string') ? 'http://' : 'https://';

async function api<T = string>(url: string, type: T extends string ? 'text' : 'json'): Promise<T> {
    if (url.startsWith('/')) {
        url = 'services.swpc.noaa.gov' + url;
    }
    url = schema + url;
    let resp = await fetch(url);
    if (resp.ok) {
        return await resp[type]() as T;
    } else {
        throw new Error(`${resp.status} ${resp.statusText} while fetching ${url}`);
    }
}


export async function get3HourKp(timePeriod: '1m' | '3h'): Promise<{time: number, kp: Kp, ap: number}[]> {
    let data = await api<[string, number, number, number][]>('/products/noaa-planetary-k-index.json', 'json');
    return data.map(x => ({time: parseTime(x[0]), kp: parseKp(x[1]), ap: x[2]}));
}

export async function get1MinuteKp(): Promise<{time: number, kp: Kp}[]> {
    let data = await api<{time_tag: string, kp: string}[]>('/json/planetary_k_index_1m.json', 'json');
    return data.map(x => ({time: parseTime(x.time_tag), kp: parseKp(x.kp)}));
}
