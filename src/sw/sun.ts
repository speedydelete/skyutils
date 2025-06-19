
import {parseTime, parseText, api} from './util.js';


export type MagClass = 'A' | 'B' | 'G' | 'BG' | 'BD' | 'BGD' | 'GD';
export type SpotClass = 'Axx' | `H${'a' | 's' | 'k' | 'h'}x` | `Bx${'o' | 'i'}` | `${'C' | 'D' | 'E' | 'F'}${'r' | 'a' | 's' | 'k' | 'h'}`;

export interface Region {
    day: number;
    firstDay: number;
    number: number;
    lat: number;
    long: number;
    carringtonLong: number;
    spots: number;
    area: number;
    magClass: MagClass;
    spotClass: SpotClass;
    cFlares: number;
    mFlares: number;
    xFlares: number;
    protonFlares: number;
    cFlareProb: number;
    mFlareProb: number;
    xFlareProb: number;
    protonFlareProb: number;
}

export async function getRegions(): Promise<Region[]> {
    let data: any[] = await api('/json/solar_regions.json');
    return data.map(data => {
        let number = parseInt(data.region) + 10000;
        if (number < 14000) {
            number += 10000;
        }
        return {
            day: parseTime(data.observed_date),
            firstDay: parseTime(data.first_date),
            number,
            lat: data.latitude,
            long: data.longitude,
            carringtonLong: data.carrington_longitude,
            spots: data.number_spots,
            area: data.area,
            magClass: data.mag_class,
            spotClass: data.spot_class,
            cFlares: data.c_xray_events,
            mFlares: data.m_xray_events,
            xFlares: data.x_xray_events,
            protonFlares: data.proton_events ?? 0,
            cFlareProb: data.c_flare_probability,
            mFlareProb: data.m_flare_probability,
            xFlareProb: data.x_flare_probability,
            protonFlareProb: data.proton_probability,
        };
    });
}

export async function getSILSOSunspotNumber(): Promise<number> {
    let data = (await api('www.sidc.be/SILSO/DATA/EISN/EISN_current.txt')).split(' ');
    return parseInt(data[data.length - 4]);
}


export interface DailySolarData {
    date: number;
    spots: number;
    f107: number;
    spotArea: number;
    newRegions: number;
    cFlares: number;
    mFlares: number;
    xFlares: number;
}

export async function getDailySolarData(): Promise<DailySolarData[]> {
    return parseText(await api('/text/daily-solar-indices.txt')).map(data => ({
        date: parseTime(data.slice(0, 3).join('-')),
        spots: parseInt(data[4]),
        f107: parseInt(data[3]),
        spotArea: parseInt(data[5]),
        newRegions: parseInt(data[6]),
        cFlares: parseInt(data[9]),
        mFlares: parseInt(data[10]),
        xFlares: parseInt(data[11]),
    }));
}
