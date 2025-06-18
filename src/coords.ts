
import {sin, cos, tan, asin, atan2, J2000_T, B1875_T} from './util.js';


export function normalizeAngle(angle: number): number {
    if (angle < 0) {
        return (angle % 360) + 360;
    } else {
        return angle % 360;
    }
}

export function normalizeDec(dec: number): number {
    if (dec > 90) {
        return 90;
    } else if (dec < -90) {
        return -90;
    } else {
        return dec;
    }
}


export function getObliquity(T: number = 0): number {
    return 23.439279444444445 - 0.013010213611111111*T - 5.0861111111111115e-8*T**2 + 5.565e-7*T**3;
}

export function equatorialToEcliptic(ra: number, dec: number, T: number = 0): [number, number] {
    let e = getObliquity(T);
    return [
        normalizeAngle(atan2(sin(ra)*cos(e) + tan(dec)*sin(e), cos(ra))),
        asin(sin(dec)*cos(e) - cos(dec)*sin(e)*sin(ra))
    ];
}

export function eclipticToEquatorial(ra: number, dec: number, T: number = 0): [number, number] {
    let e = getObliquity(T);
    return [
        normalizeAngle(atan2(sin(ra)*cos(e) - tan(dec)*sin(e), cos(ra))),
        asin(sin(dec)*cos(e) + cos(dec)*sin(e)*sin(ra))
    ];
}


export function applyPrecession(ra: number, dec: number, T1: number, T2?: number): [number, number] {
    if (T2 === undefined) {
        T2 = T1;
        T1 = J2000_T;
    }
    let prec1 = (5028.796195*T1 + 1.1054348*T1**2) / 3600;
    let prec2 = (5028.796195*T2 + 1.1054348*T2**2) / 3600;
    [ra, dec] = equatorialToEcliptic(ra, dec, T1);
    ra = normalizeAngle(ra + prec2 - prec1);
    [ra, dec] = eclipticToEquatorial(ra, dec, T2);
    return [ra, dec];
}
