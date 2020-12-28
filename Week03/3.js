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
                token.value=result[i];
            }
        }
        yield token;
    }
    yield {
        type: 'EOF'
    }
}

let source = [];
for (const token of tokenize("2 - 1")) {
    if (token.type !== "WhiteSpace" && token.type !== "LineTerminator") {
       source.push(token);
    }
}
function Expression(source) {
    if (source[0].type === "AdditiveExpression" && source[1].type === "EOF") {
        let node = {
            type: "Expression",
            children: [source.shift(), source.shift()]
        }
        source.unshift(node);
        return node;
    }
    AdditiveExpression(source);
    return Expression(source);
}

function AdditiveExpression(source) {
    if (source[0].type === "MultiplicativeExpression") {
        let node = {
            type: "AdditiveExpression",
            children: source[0]
        }
        source[0] = node;
        return AdditiveExpression(source);
    }
    if (source[0].type === "AdditiveExpression" && source[1] && source[1].value === '+') {
        let node = {
            type: "AdditiveExpression",
            operator: '+',
            children:[]
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        MultiplicativeExpression(source);
        node.children.push(source.shift())
        source.unshift(node);
        return AdditiveExpression(source);
    }
    if (source[0].type === "AdditiveExpression" && source[1] && source[1].value === '-') {
        let node = {
            type: "AdditiveExpression",
            operator: '-',
            children:[]
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        MultiplicativeExpression(source);
        node.children.push(source.shift())
        source.unshift(node);
        return AdditiveExpression(source);
    }

    if (source[0].type=== "AdditiveExpression") {
        return source[0];
    }
    MultiplicativeExpression(source);
    return AdditiveExpression(source);
}

function MultiplicativeExpression(source) {
    if (source[0].type === "Number") {
        let node = {
            type: "MultiplicativeExpression",
            children: [source[0]]
        }
        source[0] = node;
        return MultiplicativeExpression(source);
    }
    if (source[0].type === "MultiplicativeExpression" && source[1] && source[1].value === "*") {
        let node = {
            type : "MultiplicativeExpression",
            operator: "*",
            children: []
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        node.children.push(source.shift());
        source.unshift(node);
        return MultiplicativeExpression(source);
    }
    if (source[0].type === "MultiplicativeExpression" && source[1] && source[1].value === "/") {
        let node = {
            type : "MultiplicativeExpression",
            operator: "/",
            children: []
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        node.children.push(source.shift());
        source.unshift(node);
        return MultiplicativeExpression(source);
    }

    if (source[0].type=== "MultiplicativeExpression") {
        return source[0];
    }
    return MultiplicativeExpression(source);
}

console.log(Expression(source));
