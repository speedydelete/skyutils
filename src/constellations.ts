
import {B1875_T, J2000_T} from './util.js';
import {applyPrecession} from './coords.js';
import DATA from '../data/constellations.json' with {type: 'json'};
import _BORDERS from '../data/constellation_borders.json' with {type: 'json'};
const BORDERS = _BORDERS as [string, number, number, number][];


export class Constellation {

    name: string;
    genitive: string;
    abbr: string;

    constructor(name: string, genitive: string, abbr: string) {
        this.name = name;
        this.genitive = genitive;
        this.abbr = abbr;
    }

}

export const CONSTELLATIONS: Constellation[] = [];

for (let [name, data] of Object.entries(DATA)) {
    CONSTELLATIONS.push(new Constellation(name, data[0] as string, data[1] as string));
}


export const CONSTELLATION_MAP = new Map<string, Constellation>();

for (let c of CONSTELLATIONS) {
    CONSTELLATION_MAP.set(c.name, c);
    CONSTELLATION_MAP.set(c.genitive, c);
    CONSTELLATION_MAP.set(c.abbr, c);
}

export function lookupConstellation(id: string): Constellation {
    let out = CONSTELLATION_MAP.get(id);
    if (!out) {
        throw new Error(`Unable to find constellation '${id}'`);
    }
    return out;
}


export function getConstellation(ra: number, dec: number): string {
    let [ara, adec] = applyPrecession(ra, dec, B1875_T, J2000_T);
    let mode: 'dec' | 'rau' | 'ral' = 'dec';
    for (let i = 0; i < BORDERS.length; i++) {
        let [c, dec, ral, rau] = BORDERS[i];
        if (mode === 'dec') {
            if (dec <= adec) {
                mode = 'rau';
            }
        }
        if (mode === 'rau') {
            if (rau >= ara) {
                mode = 'ral';
            }
        }
        if (mode === 'ral') {
            if (ral <= ara) {
                if (rau >= ara) {
                    return c;
                } else {
                    mode = 'rau';
                }
            }
        }
    }
    throw new Error(`Failed to find constellation for right ascension ${ra}° and declination ${dec}°`);
}
