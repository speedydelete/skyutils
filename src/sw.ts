
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


type NOAAScaleValue = 1 | 2 | 3 | 4 | 5;

export interface RSG {
    R: NOAAScaleValue;
    S: NOAAScaleValue;
    G: NOAAScaleValue;
}

export interface RSGPredictions {
    R12Prob: number;
    R35Prob: number;
    SProb: number;
    G: NOAAScaleValue;
}

export async function getNOAAScales(): Promise<{time: number, now: RSG, dayMax: RSG, preds: [RSGPredictions, RSGPredictions, RSGPredictions]}> {
    let data = await api<any>('/products/noaa-scales.json', 'json');
    return {
        time: parseTime(data[0].DateStamp + ' ' + data[0].TimeStamp),
        now: {R: data[0].R.Scale, S: data[0].S.Scale, G: data[0].G.Scale},
        dayMax: {R: data[-1].R.Scale, S: data[-1].S.Scale, G: data[-1].G.Scale},
        preds: ([1, 2, 3] as const).map(i => ({
            R12Prob: data[i].R.MinorProb,
            R35Prob: data[i].R.MajorProb,
            SProb: data[i].S.Prob,
            G: data[i].G.Scale,
        })) as [RSGPredictions, RSGPredictions, RSGPredictions],
    };
}

export async function get3HourKp(): Promise<{time: number, kp: Kp, ap: number}[]> {
    let data = await api<[string, number, number, number][]>('/products/noaa-planetary-k-index.json', 'json');
    return data.slice(1).map(x => ({time: parseTime(x[0]), kp: parseKp(x[1]), ap: x[2]}));
}

export async function get1MinuteKp(): Promise<{time: number, kp: Kp}[]> {
    let data = await api<{time_tag: string, kp: string}[]>('/json/planetary_k_index_1m.json', 'json');
    return data.slice(1).map(x => ({time: parseTime(x.time_tag), kp: parseKp(x.kp)}));
}

export async function getDST(): Promise<{time: number, dst: number}[]> {
    let data = await api<[string, number][]>('/products/kyoto-dst.json', 'json');
    return data.slice(1).map(x => ({time: parseTime(x[0]), dst: x[1]}));
}
