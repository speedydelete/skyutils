
import {sin, cos, tan, asin, atan2, J2000} from './util.js';


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
        atan2(sin(ra)*cos(e) + tan(dec)*sin(e), cos(ra)),
        asin(sin(dec)*cos(e) - cos(dec)*sin(e)*sin(ra))
    ];
}

export function eclipticToEquatorial(ra: number, dec: number, T: number = 0): [number, number] {
    let e = getObliquity(T);
    return [
        atan2(sin(ra)*cos(e) - tan(dec)*sin(e), cos(ra)),
        asin(sin(dec)*cos(e) - cos(dec)*sin(e)*sin(ra))
    ];
}


export function getPrecession(jd1: number, jd2?: number): number {
    if (jd2 === undefined) {
        jd2 = jd1;
        jd1 = J2000;
    }
    let prec1 = (5.028796195*jd1 + 0.00011054348*jd1**2) / 3600;
    let prec2 = (5.028796195*jd2 + 0.00011054348*jd2**2) / 3600;
    return prec2 - prec1;
}

export function applyPrecession(ra: number, dec: number, prec: number): [number, number] {
    [ra, dec] = equatorialToEcliptic(ra, dec);
    ra = normalizeAngle(ra + prec);
    [ra, dec] = eclipticToEquatorial(ra, dec);
    return [ra, dec];
}
