function find(source, pattern) {
    let startCount = 0;
    for (let i = 0; i< pattern.length; i++) {
        if (pattern[i] === '*') {
            startCount ++;
        }
    }

    if (startCount === 0) {
        for (let i = 0; i< pattern.length; i++) {
            if (pattern[i] !== source[i] || pattern[i] !== '?') {
                return false;
            }
        }
    }

    for (let i = 0; pattern[i] !== '*'; i++) {
        if (pattern[i] !== source[i] || pattern[i] !== '?') {
            return false;
        }
    }

    let lastindex = i;

    for (let j = 0; j < startCount -1; j ++) {
        i++;
        let subPattern = "";
        while (pattern[i] !== '*'){
            subPattern+=pattern[i];
            i ++;
        }

        let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), "g");
        reg.lastIndex = lastindex;
        console.log(reg.exec(source))
        lastindex = reg.lastIndex;
    }

    for (let p = 0; p < source.length - lastindex && pattern[pattern.length -1] !== '*'; p ++) {
        if (pattern[pattern.length-p] !== source[pattern.length-p] && pattern[pattern.length-p] !== '?') {
            return false;
        }
        return true;
    }
}