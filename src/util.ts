
export const {E, LN10, LN2, LOG10E, LOG2E, PI, SQRT1_2, SQRT2, abs, cbrt, ceil, clz32, exp, expm1, floor, fround, hypot, imul, log, log10, log1p, log2, max, min, pow, sign, sqrt} = Math;
export const DTR = PI / 180;
export const sin = (x: number) => Math.sin(x * DTR);
export const cos = (x: number) => Math.cos(x * DTR);
export const tan = (x: number) => Math.tan(x * DTR);
export const asin = (x: number) => Math.asin(x) / DTR;
export const acos = (x: number) => Math.acos(x) / DTR;
export const atan = (x: number) => Math.atan(x) / DTR;
export const atan2 = (x: number, y: number) => Math.atan2(x, y) / DTR;
export const random = (min: number = 0, max: number = 1) => Math.random() * (max - min) + min;
export const round = (x: number, digits: number = 0) => Math.round(x * 10**digits) / 10**digits;
export const trunc = (x: number, digits: number = 0) => Math.trunc(x * 10**digits) / 10**digits;
export const sum = (...values: (number | number[])[]) => values.flat(1).reduce((x, y) => x + y);


export const C = 299792458;
export const G = 6.67430e-11;

export const AU = 149597870700;
export const LY = 9.4607304725808e+15;
export const PARSEC = 648000 * AU / PI;

export const GREEK_LETTERS: {[key: string]: string} = {'alf': 'α', 'bet': 'β', 'gam': 'γ', 'del': 'δ', 'eps': 'ε', 'zet': 'ζ', 'eta': 'η', 'tet': 'θ', 'iot': 'ι', 'kap': 'κ', 'lam': 'λ', 'mu.': 'µ', 'nu.': 'ν ', 'ksi': 'ξ', 'omi': 'o', 'pi.': 'π', 'rho': 'ρ', 'sig': 'σ', 'tau': 'τ', 'ups': 'υ', 'phi': 'φ', 'khi': 'χ', 'psi': 'ψ', 'ome': 'ω'};


export function parseTime(time: string): number {
    if (!time.includes('Z')) {
        time += 'Z';
    }
    return (new Date(time)).getTime() / 1000;
}

export function toJD(time: number | Date): number {
    if (time instanceof Date) {
        time = time.getTime() / 1000;
    }
    return (time / 86400) + 2440587.5;
}

export function toUnix(jd: number): number {
    return (jd - 2440587.5) * 86400;
}

export const J2000 = 2451545.0;
export const J2000_TIME = toUnix(J2000);

export function besselianToJD(b: number): number {
    return (b - 1900) * 365.242198781 + 2415020.31352;
}

export function jdToBesselian(jd: number): number {
    return 1900 + (jd - 2415020.31352) / 365.242198781;
}

export const B1875 = besselianToJD(1875);
export const B1875_TIME = toUnix(B1875);

export function getTime(): number {
    return (new Date()).getTime() / 1000;
}

export function getJD(): number {
    return toJD(getTime());
}

export function getT(): number {
    return getJD() / 36525;
}
