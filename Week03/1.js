const reg = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;

const dictionary = ["Number", "WhiteSpace", "LineTerminator", "*", "/", "+", "-"];

function tokenize(source) {
    let result = null;
    while (true) {
        result = reg.exec(source);

        if (!result) break;

        for (let i = 1; i <= dictionary.length; i++) {
            if (result[i]) {
                console.log(dictionary[i-1]);
            }
        }
        console.log(result)
    }
}

tokenize("2 - 1");