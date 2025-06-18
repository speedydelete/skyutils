
import {B1875} from './util.js';
import {applyPrecession, getPrecession} from './coords.js';
import DATA from '../data/constellations.json' with {type: 'json'};
import RAW_BORDERS from '../data/constellation_borders.json' with {type: 'json'};


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


let prec = getPrecession(B1875);
const BORDERS = (RAW_BORDERS as [string, number, number, number][]).map(x => [x[0], x[1], ...applyPrecession(x[2], x[3], prec)] as const);

export function getConstellation(ra: number, dec: number): string {
    let i = BORDERS.findIndex(x => x[3] <= dec);
    while (i < BORDERS.length) {
        let searchingLowest = false;
        for (; i < BORDERS.length; i++) {
            let [c, rau, ral] = BORDERS[i];
            if (searchingLowest) {
                if (ral <= ra) {
                    if (rau >= ra) {
                        return c;
                    } else {
                        break;
                    }
                }
            } else {
                if (rau >= ra) {
                    searchingLowest = true;
                }
            }
        }
    }
    throw new Error(`Failed to find constellation for right ascension ${ra}° and declination ${dec}°`);
}

