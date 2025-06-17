
import {abs, sign, sqrt, sin, cos, acos, atan2} from './util';


export class Vector3 {

    x: number;
    y: number;
    z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    get [0](): number {
        return this.x;
    }

    get [1](): number {
        return this.y;
    }

    get [2](): number {
        return this.z;
    }

    set [0](value: number) {
        this.x = value;
    }

    set [1](value: number) {
        this.y = value;
    }

    set [2](value: number) {
        this.z = value;
    }

    toString(): string {
        return `${this.x}, ${this.y}, ${this.z}`;
    }

    [Symbol.iterator](): ArrayIterator<number> {
        return [this.x, this.y, this.z][Symbol.iterator]();
    }

    copy(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    set(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    setTo(other: Vector3): this {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }

    add(other: Vector3 | number): Vector3 {
        if (typeof other === 'number') {
            return new Vector3(this.x + other, this.y + other, this.z + other);
        } else {
            return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
        }
    }

    sub(other: Vector3 | number): Vector3 {
        if (typeof other === 'number') {
            return new Vector3(this.x - other, this.y - other, this.z - other);
        } else {
            return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
        }
    }

    mul(other: Vector3 | number): Vector3 {
        if (typeof other === 'number') {
            return new Vector3(this.x * other, this.y * other, this.z * other);
        } else {
            return new Vector3(this.x * other.x, this.y * other.y, this.z * other.z);
        }
    }

    div(other: Vector3 | number): Vector3 {
        if (typeof other === 'number') {
            return new Vector3(this.x / other, this.y / other, this.z / other);
        } else {
            return new Vector3(this.x / other.x, this.y / other.y, this.z / other.z);
        }
    }

    mod(other: Vector3 | number): Vector3 {
        if (typeof other === 'number') {
            return new Vector3(this.x % other, this.y % other, this.z % other);
        } else {
            return new Vector3(this.x % other.x, this.y % other.y, this.z % other.z);
        }
    }

    neg(): Vector3 {
        return new Vector3(-this.x, -this.y, -this.z);
    }

    addMut(other: Vector3 | number): this {
        if (typeof other === 'number') {
            this.x += other;
            this.y += other;
            this.z += other;
        } else {
            this.x += other.x;
            this.y += other.y;
            this.z += other.z;
        }
        return this;
    }

    subMut(other: Vector3 | number): this {
        if (typeof other === 'number') {
            this.x -= other;
            this.y -= other;
            this.z -= other;
        } else {
            this.x -= other.x;
            this.y -= other.y;
            this.z -= other.z;
        }
        return this;
    }

    mulMut(other: Vector3 | number): this {
        if (typeof other === 'number') {
            this.x *= other;
            this.y *= other;
            this.z *= other;
        } else {
            this.x *= other.x;
            this.y *= other.y;
            this.z *= other.z;
        }
        return this;
    }

    divMut(other: Vector3 | number): this {
        if (typeof other === 'number') {
            this.x /= other;
            this.y /= other;
            this.z /= other;
        } else {
            this.x /= other.x;
            this.y /= other.y;
            this.z /= other.z;
        }
        return this;
    }

    modMut(other: Vector3 | number): this {
        if (typeof other === 'number') {
            this.x %= other;
            this.y %= other;
            this.z %= other;
        } else {
            this.x %= other.x;
            this.y %= other.y;
            this.z %= other.z;
        }
        return this;
    }

    negMut(): this {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    abs(): number {
        return Math.sqrt(this.x**2 + this.y**2 + this.z**2);
    }

    eq(other: Vector3): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    ne(other: Vector3): boolean {
        return this.x !== other.x || this.y !== other.y || this.z !== other.z;
    }

    lt(other: Vector3): boolean {
        return this.x < other.x && this.y < other.y && this.z < other.z;
    }

    le(other: Vector3): boolean {
        return this.x <= other.x && this.y <= other.y && this.z <= other.z;
    }

    gt(other: Vector3): boolean {
        return this.x > other.x && this.y > other.y && this.z > other.z;
    }

    ge(other: Vector3): boolean {
        return this.x >= other.x && this.y >= other.y && this.z >= other.z;
    }

    distanceTo(other: Vector3): number {
        return Math.sqrt((this.x - other.x)**2 + (this.y - other.y)**2 + (this.z - other.z)**2);
    }

    closestTo(...vectors: (Vector3 | Vector3[])[]): Vector3 {
        let vecs = vectors.flat();
        let minDist = this.distanceTo(vecs[0]);
        let out = vecs[0];
        for (let vec of vecs.slice(1)) {
            let dist = this.distanceTo(vec);
            if (dist < minDist) {
                minDist = dist;
                out = vec;
            }
        }
        return out;
    }

    clamp(other: Vector3): this {
        if (abs(this.x) > abs(other.x)) {
            this.x = sign(this.x) * other.x;
        }
        if (abs(this.y) > abs(other.y)) {
            this.y = sign(this.y) * other.y;
        }
        if (abs(this.z) > abs(other.z)) {
            this.z = sign(this.z) * other.z;
        }
        return this;
    }

    toSpherical(): {ra: number, dec: number, dist: number} {
        let dist = sqrt(this.x**2 + this.y**2 + this.z**2);
        return {ra: acos(this.z / dist), dec: atan2(this.y, this.x), dist};
    }
    
    cross(other: Vector3): Vector3 {
        return new Vector3(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x,
        );
    }

    static fromSpherical(ra: number, dec: number, dist: number = 1): Vector3 {
        return new Vector3(sin(dec) * cos(ra) * dist, sin(dec) * sin(ra) * dist, cos(dec) * dist);
    }

    normalize(): this {
        let abs = this.abs();
        this.x /= abs;
        this.y /= abs;
        this.z /= abs;
        return this;
    }

    dot(other: Vector3): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

}
