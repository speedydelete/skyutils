
import {parseTime, Kp, parseKp, parseText, api} from './util.js';


type NOAAScaleValue = 1 | 2 | 3 | 4 | 5;

export interface NOAAScaleData {
    R: NOAAScaleValue;
    S: NOAAScaleValue;
    G: NOAAScaleValue;
}

export interface NOAAScalesPreds {
    R12Prob: number;
    R35Prob: number;
    SProb: number;
    G: NOAAScaleValue;
}

export interface NOAAScales {
    time: number;
    now: NOAAScaleData;
    '24hMax': NOAAScaleData;
    preds: [NOAAScalesPreds, NOAAScalesPreds, NOAAScalesPreds];
}

export async function getNOAAScales(): Promise<NOAAScales> {
    let data = await api<any>('/products/noaa-scales.json');
    return {
        time: parseTime(data[0].DateStamp + ' ' + data[0].TimeStamp),
        now: {
            R: data[0].R.Scale,
            S: data[0].S.Scale,
            G: data[0].G.Scale,
        },
        '24hMax': {
            R: data[-1].R.Scale,
            S: data[-1].S.Scale,
            G: data[-1].G.Scale
        },
        preds: [1, 2, 3].map(i => ({
            R12Prob: data[i].R.MinorProb,
            R35Prob: data[i].R.MajorProb,
            SProb: data[i].S.Prob,
            G: data[i].G.Scale,
        })) as NOAAScales['preds'],
    };
}


export async function get3HourKp(): Promise<{time: number, kp: Kp, ap: number}[]> {
    let data: any[] = await api('/products/noaa-planetary-k-index.json');
    return data.slice(1).map((row: any) => ({
        time: parseTime(row[0]),
        kp: parseKp(row[1]),
        ap: row[2],
    }));
}

export async function get1MinuteKp(): Promise<{time: number, kp: Kp}[]> {
    let data: any[] = await api('/json/planetary_k_index_1m.json');
    return data.slice(1).map((row: any) => ({
        time: parseTime(row.time_tag),
        kp: parseKp(row.kp),
    }));
}

export async function getDST(): Promise<{time: number, dst: number}[]> {
    let data: any[] = await api('/products/kyoto-dst.json');
    return data.slice(1).map((row: any) => ({
        time: parseTime(row[0]),
        dst: row[1],
    }));
}


export interface IMFData {
    time: number;
    bx: number;
    by: number;
    bz: number;
    bt: number;
}

export type TimePeriod = '5-minute' | '2-hour' | '6-hour' | '1-day' | '3-day' | '7-day';

export async function getIMF(timePeriod: TimePeriod = '5-minute'): Promise<IMFData[]> {
    let data: any[] = await api('/products/solar-wind/mag-' + timePeriod + '.json') as any;
    return data.slice(1).map((row: any) => ({
        time: parseTime(row[0]),
        bx: row[1],
        by: row[2],
        bz: row[3],
        bt: row[6],
    }));
}

export interface FullIMFData extends IMFData {
    theta: number;
    phi: number;
}

export async function getFullIMF(): Promise<FullIMFData[]> {
    let data: any[] = await api('/json/dscovr/dscovr_mag_1s.json');
    return data.slice(1).map((row: any) => ({
        time: parseTime(row.time_tag),
        bx: row.bx_gsm,
        by: row.by_gsm,
        bz: row.bz_gsm,
        bt: row.bt,
        theta: row.theta_gsm,
        phi: row.phi_gsm,
    }));
}

export interface SolarWindData {
    time: number;
    density: number;
    speed: number;
    temperature: number;
}

export async function getSolarWind(timePeriod: TimePeriod = '5-minute'): Promise<SolarWindData[]> {
    let data: any[] = await api('/products/solar-wind/mag-' + timePeriod + '.json') as any;
    return data.slice(1).map((row: any): SolarWindData => ({
        time: parseTime(row[0]),
        density: row[1],
        speed: row[2],
        temperature: row[3],
    }));
}


export interface OVATIONData {
    observationTime: number;
    forecastTime: number;
    data: [number, number, number][];
}

export async function getOVATION(): Promise<OVATIONData> {
    let data = await api('/json/ovation_aurora_latest.json');
    return {
        observationTime: parseTime(data['Observation Time']),
        forecastTime: parseTime(data['Forecast Time']),
        data: data.coordinates,
    };
}

export interface HPIData {
    observationTime: number;
    forecastTime: number;
    north: number;
    south: number;
}

export async function getHPI(): Promise<HPIData[]> {
    let data = parseText(await api('/text/aurora-nowcast-hemi-power.txt'));
    return data.map(x => ({
        observationTime: parseTime(x[0]),
        forecastTime: parseTime(x[1]),
        north: parseInt(x[2]),
        south: parseInt(x[3]),
    }));
}
