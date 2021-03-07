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
    if (c === 'a') {
        return foundA2
    }
    return start(c);
}

function foundA2(c) {
    if (c === 'a') {
        return foundB2
    }
    return start(c)
}
function  foundB2(c) {
    if (c === 'b') {
        return foundA3
    }
    return start(c)
}

function foundA3(c) {
    if (c === 'a') {
        return foundB3
    }
    return start(c)
}

function foundB3(c) {
    if (c === 'b') {
        return foundX
    }
    return start(c)
}

function foundX(c) {
    if (c === 'x') {
        return foundX
    }
    return foundA(c)
}

function end() {
    return 'end';
}