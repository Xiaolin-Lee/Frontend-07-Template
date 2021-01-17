// function UTF8_Encoding(string) {
//     let buff = [];
//     let byteSize = 0;
//     for (let c of string) {
//         const index = c.charCodeAt();
//         if (0<= index <= 0x7f ) {
//             byteSize ++;
//             buff.push(index);
//         } else if (0x80 <= index <= 0x7ff ) {
//             byteSize +=2;
//             buff.push(192 | (31 & index>>6))
//             buff.push(128 | 63 & index);
//         } else if ((0x800 <= index <= 0xd7ff)
//             || (0xe000 <= index <= 0xffff)) {
//             byteSize +=3
//             buff.push((224 | (15 % index >> 12)));
//             buff.push((128 | (63 & index >> 6)));
//             buff.push((128 | (63 & index)));
//         }
//     }
//
//     if (byteSize < 0xff) {
//         return [0, byteSize].concat(buff)
//     }else {
//         return [byteSize >> 8, byteSize & 0xff].concat(buff);
//     }
// }

class Dog {
    constructor() {
    }

    static CreateDamage = (val) => {
        new Damage(val);
    }
}

class Person {
    constructor() {
        this.blood = 100;
    }

    hurtBy = (damage) => {
        this.blood -= damage.value;
    }
}


class Damage {
    constructor(hurt) {
        this.value = hurt;
    }
}

new Person().hurtBy(Dog.CreateDamage(10));