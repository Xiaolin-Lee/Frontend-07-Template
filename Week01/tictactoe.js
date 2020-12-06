let originPattern = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

let pattern = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
const boardText = ["",'❌', '⭕️'];
const board = document.getElementById('board');
let current = 1;
show();

function clone(pattern) {
    return JSON.parse(JSON.stringify(pattern));
}

function show() {
    board.innerHTML = '';
    for (let i = 0; i < pattern.length; i ++ ){
        for (let j = 0; j < pattern[i].length; j ++ ){
            const div = document.createElement('div');
            div.classList.add('cell');
            div.innerText = boardText[pattern[i][j]];
            div.addEventListener('click',() => userMove(i, j));
            board.appendChild(div);
        }
        board.appendChild(document.createElement('br'));
    }
}

function moveTo(i, j) {
    pattern[i][j] = current;
    show();
    if (win(pattern, current)) {
        alert(`${boardText[current]} is winner!`);
        pattern = originPattern;
    }
    current = 3 - current;
    return current;
}

function userMove(i, j) {
    const next = moveTo(i, j);
    if (!!willWin(pattern, next)) {
        console.log(`${boardText[ next]} will win!`)
    }
    computerMove(bestChoice(pattern, current));
}

function computerMove(choice) {
    if (!!choice.point) {
        const [i, j] = choice.point;
        moveTo(i, j);
    }
}

function bestChoice(pattern, current) {
    let point = willWin(pattern, current);
    if (!!point ) {
        return {
            point: point,
            result: 1
        }
    }
    let result = -2;
    for (let i = 0; i < pattern.length; i++){
        for (let j = 0; j< pattern[i].length; j ++) {
            if (pattern[i][j] === 0) {
                const temp = clone(pattern);
                temp[i][j] = current;

                let r = bestChoice(temp, 3-current).result;
                if (-r > result) {
                    result = -r;
                    point = [i, j];
                }

                if (result === 1) {
                    break;
                }
            }
        }
    }

    return {
        point,
        result: point ? result: 0,
    }
}

function willWin(pattern, current) {
    for (let i = 0; i< pattern.length; i ++) {
        for (let j = 0; j < pattern.length; j ++) {
            if (!pattern[i][j]) {
                const temp = clone(pattern);
                temp[i][j] = current;
                if (win(temp, current)) {
                    return [i, j];
                }
            }
        }
    }
    return null;
}

function win(pattern, current) {
    return lineWin(pattern, current) || lineWin(pattern, current, false) || diagonalWin(pattern, current);
}

function lineWin(pattern, current, byRow = true) {
    let result = false;
    for (let i = 0; i < 3; i ++) {
        for (let j = 0; j < pattern[i].length; j++ ){
            if (byRow) {
                result = pattern[i][j] === current;
            }
            else {
                result = pattern[j][i] === current;
            }
            if (!result) break;
        }
        if (result) {
            return true;
        }
    }
    return result;
}

function diagonalWin(pattern, current) {
    let result = false;
    for (let i = 0; i < 3; i ++) {
        result = pattern[i][i] === current;
        if (!result) {
            break;
        }
    }
    if (result) return true;
    for (let i = 0; i < 3; i ++) {
        result = pattern[i][2-i] === current;
        if (!result) {
            break;
        }
    }
    return result;
}