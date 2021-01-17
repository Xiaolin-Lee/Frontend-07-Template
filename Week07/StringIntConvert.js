function StringToNumber(str) {
    if (typeof str !== 'string') {
        console.error('invalid format')
        return ;
    }
    if (str.startsWith('0x')) {
        return parseInt(str, 16)
    } else if (str.startsWith('0b')){
        return parseInt(str.slice(2),2);
    } else if (str.startsWith('0')) {
        return parseInt(str, 8);
    } else {
        return parseInt(str)
    }
}

function NumberToString(number, system = 10) {
    let result = "";
    if (typeof system !== 'number' || system <= 0) {
        console.error('invalid parameter')
        return;
    }
    result = number.toString(system);
    if (system === 2) {
        return `0b${result}`
    }else if (system === 8) {
        return `0${result}`
    } else if (system === 16) {
        return `0x${result}`
    }
    return result;
}