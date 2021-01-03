function kmp(source, pattern) {
    const table = new Array(pattern.length).fill(0);
    let j = 0;
    let i = 1;

    while (i < pattern.length) {
        if (pattern[i] === pattern[j]) {
            ++i; ++j;
            table[i] = j;
        }
        else {
            if (j > 0) {
                j = table[j];
            } else {
                ++i;
            }
        }
    }
    console.log(table)
    {
        let j = 0;
        for (let i = 0; i< source.length; i++) {
            if (j === pattern.length) {
                return true;
            }
            if (source[i] === pattern[j]) {
                j++;
            }
            else {
                if (j > 0) {
                    j = table[j];
                }
            }
        }
        return false;
    }
}
// kmp("", "abababc")
// kmp("", "abcdabce")
// kmp("", "aabaaac")
console.log(kmp("abacbab", "abababca"));