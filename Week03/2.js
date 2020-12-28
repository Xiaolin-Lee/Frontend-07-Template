const reg = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;
const dictionary = ["Number", "WhiteSpace", "LineTerminator", "*", "/", "+", "-"];

function* tokenize(source) {
    let result = null;
    let lastIndex=0;
    while (true) {
        lastIndex = reg.lastIndex;
        result = reg.exec(source);
        if (!result) {
            break;
        }

        if (reg.lastIndex - lastIndex > result[0].length) {
            break;
        }
        
        let token = {
            type: null,
            value: null
        }
        for (let i = 1; i<=dictionary.length; i++){
            if (result[i]) {
                token.type = dictionary[i-1];
                token.value= result[i];
            }
        }
        yield token;
    }
    yield {
        type: 'EOF'
    }
}

for (const token of tokenize('2 - 1')) {
    console.log(token);
}