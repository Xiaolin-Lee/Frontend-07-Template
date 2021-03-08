const css = require('css')
const EndOfFile = Symbol("EOF");
const layout = require('./layout');

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let stack = [{type: "document", children:[]}];
let rules = [];

function specify(selector) {
    const p = [0, 0, 0, 0];
    const selectors = selector.split(" ");
    for (const selector of selectors) {
        if (selector.startsWith("#")) {
            p[1] += 1;
        } else if (selector.startsWith(".")) {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}

function compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0];
    } else if (sp1[1] - sp2[1]) {
        return sp1[1] - sp2[1];
    } else if (sp1[2] - sp2[2]) {
        return sp1[2] - sp2[2];
    }
    return sp1[3] - sp2[3];
}
function addCssRules(content) {
    let ast = css.parse(content);
    rules.push(...ast.stylesheet.rules);
}

function match (selector, element) {
    if (!selector || !element.attributes) {
        return false;
    }

    if (selector.charAt(0) === '#') {
        const idAttr = element.attributes.find(attr => attr.name === "id");
        return !!idAttr && idAttr.value === selector.replace("#", "");
    } else if (selector.charAt(0) === ".") {
        const classAttr = element.attributes.find(attr => attr.name === "class");
        const classes = !!classAttr && classAttr.value.split(" ");
        return !!classes && classes.includes(selector.replace(".", ""));
    } else {
        return element.tagName === selector;
    }
    return false;
}
function computeCss(element) {
    let elements = stack.slice().reverse();
    if (!element.computedStyle) {
        element.computedStyle = {};

        for (let rule of rules) {
            let selector = rule.selectors[0].split(' ').reverse();
            if (!match(selector[0], element)) {
                continue;
            }

            let matched = false;
            let  j = 1;

            for (let i = 0; i< elements.length; i ++) {
                if (match(selector[j], elements[i])) {
                    j ++;
                }
            }

            if (j >= selector.length) {
                matched = true;
            }

            if (matched) {
                const sp = specify(rule.selectors[0]);
                const computedStyle = element.computedStyle;
                for (let declaration of rule.declarations) {
                    if (!computedStyle[declaration.property]) {
                        computedStyle[declaration.property] = {};
                        if (!computedStyle[declaration.property].spicificity) {
                            computedStyle[declaration.property] = declaration.value;
                            computedStyle[declaration.property].spicificity = sp;
                        } else if (compare(computedStyle[declaration.property].spicificity, sp) < 0) {
                            computedStyle[declaration.property] = declaration.value;
                            computedStyle[declaration.property].spicificity = sp;
                        }
                    }
                }
            }
        }

    }
}

function data(c) {
     if (c === '<') {
        return tagOpen;
    } else if (c === EndOfFile) {
        emit({
            type: 'EOF'
        });
        return ;
    } else {
         emit({
             type: "text",
             content: c
         });
          return data;
    }
}
function emit(token) {
    let top = stack[stack.length -1];

    if (token.type === "startTag") {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        }
        element.tagName = token.tagName;
        for (let p in token) {
            if (p !== 'type' && p !== 'tagName') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }
        computeCss(element);

        top.children.push(element);
        element.parent = top;

        if (!token.isSelfClosingTag) {
            stack.push(element);
        }
        currentTextNode = null;

    } else if (token.type === 'endTag') {
        if (top.tagName !== token.tagName) {
            throw new Error("Tag start end doesn't match!");
        } else {
            if (top.tagName === 'style') {
                addCssRules(top.children[0].content);
            }
            layout(top);
            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type === 'text') {
        if (currentTextNode === null) {
            currentTextNode = {
                type: 'text',
                content: ''
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}
function tagOpen(c) {
    if (c === '/') {
        return endTagOpen;
    } else if (c.match(/[a-zA-Z]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c);
    } else {
        return;
    }
}

function endTagOpen(c) {
    if (c.match(/[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c);
    } else if (c ==='>') {
        return ;
    } else if (c === EndOfFile){
        return ;
    }
}

function tagName(c) {
    if (c.match(/[\f\t\n ]$/)) {
        return beforeAttributeName
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c.match(/[a-zA-Z]$/)) {
        currentToken.tagName += c;
        return tagName;
    } else if (c === '>') {
        emit(currentToken)
        return data;
    } else {
        return tagName;
    }
}

function beforeAttributeName(c) {
    if (c.match(/[\f\t\n ]$/)) {
        return beforeAttributeName
    } else if (c === '/'|| c === '>' || c === '|' || c === EndOfFile) {
        return afterAttributeName(c);
    } else if (c === '=') {
        return ;
    } else {
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c)
    }
}

function afterAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (c === "/") {
        return selfClosingStartTag;
    } else if (c === "=") {
        return beforeAttributeValue;
    } else if (c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === EndOfFile) {

    } else {
        if (currentAttribute && currentAttribute.name) {
            currentToken[currentAttribute.name] = currentAttribute.value;
        }
        currentAttribute = {
            name: "",
            value: ""
        };
        return attributeName(c);
    }
}

function attributeName(c) {
    if (c.match(/[\f\t\n ]$/) || c === '>' || c === '|' || c === EndOfFile) {
        return afterAttributeName(c);
    } else if (c === '=') {
        return beforeAttributeValue;
    } else if (c === '\u0000') {

    } else if (c === "\"" || c ==="'" || c === "<") {

    } else {
        currentAttribute.name +=c;
        return attributeName;
    }
}

function beforeAttributeValue(c) {
    if (c.match(/[\f\t\n ]$/) || c === '>' || c === '|' || c === EndOfFile) {
        return beforeAttributeValue;
    } else if (c === "\"" ) {
        return doubleQuotedAttributeValue;
    } else if (c === "\'") {
        return singleQuotedAttributeValue;
    } else {
        return unQuotedAttributedValue(c);
    }
}

function doubleQuotedAttributeValue(c) {
    if (c === "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c === EndOfFile) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}
function afterQuotedAttributeValue(c) {
    if (c.match(/[\f\t\n ]$/)) {
        return beforeAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (EndOfFile) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c) {
    if (c === "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c === EndOfFile) {

    } else {
        currentAttribute.value += c;
        return singleQuotedAttributeValue;
    }
}

function unQuotedAttributedValue(c) {
    if (c.match(/[\f\t\n ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c === "/") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === '\u0000') {

    } else if (c === "\"" || c ==="'" || c === "<") {

    } else {
        currentAttribute.value += c;
        return unQuotedAttributedValue;
    }
}
function selfClosingStartTag(c) {
    if (c === '>') {
        currentToken.isSelfClosingTag = true;
        emit(currentToken);
        return data;
    } else if (c === EndOfFile) {
        return ;
    } else {
        return;
    }
}


module.exports.parse = (html) => {
    let state = data;
    for (let c of html) {
        state = state(c);
    }

    state = state(EndOfFile);
    return stack[0];
    // console.log(stack[0]);
    // console.log(rules)
}