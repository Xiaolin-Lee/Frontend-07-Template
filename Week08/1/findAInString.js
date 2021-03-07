function findA(str) {
    return /a/.exec(str);
}

function findMatchWithoutReg(str) {
    return str.includes("ab")
}


function findPattern(str, pattern, deep = 0) {
    if (str.length < pattern.length) {
        return false;
    }

    if (str[0] === pattern[0]) {
        if (pattern.length === 1) {
            return true;
        }
        return findPattern(str.slice(1), pattern.slice(1), deep + 1);
    }
    if (!deep) {
        return findPattern(str.slice(1), pattern);
    }
    return false;
}

function match(str) {
    let state = start;
    for (let c of str) {
        state = state(c)
    }
    return state === 'end';
}

function start(c) {
    if (c === 'a') {
        return foundA;
    } else {
        return start(c);
    }
}

function foundA(c) {
    if (c === 'b') {
        return foundB
    }
    else {
        return start(c);
    }
}

function foundB(c) {
    if (c === 'c') {
        return foundC
    }
    else {
        return start(c);
    }
}
function foundC(c) {
    if (c === 'c') {
        return foundA2
    }
    else {
        return start(c);
    }
}

function foundA2(c) {
    if (c === 'b') {
        return foundB2
    }
    else {
        return start(c);
    }
}
function foundB2(c) {
    if (c === 'x') {
        return foundX
    }
    else {
        return start(c);
    }
}

function foundX(c) {
    if (c === 'x') {
        return end();
    }
    return foundB(c);
}
function end() {
    return 'end';
}
