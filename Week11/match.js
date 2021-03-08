function match(selector, element) {
    const selectors = selector.split(' ').reverse();
    let matched = false;
    let currentElement = element;

    for (const select of selectors) {
        const allSelectors = getAllSelector(select);
        if (allSelectors.length > 1) {
            matched = matchMultipleSelector(allSelectors, currentElement);
            if (!matched) {
                return matched;
            }
        }
        matched = matchSingleSelector(allSelectors[0], currentElement);
        if (!matched) {
            return matched;
        }

        currentElement = element.parentNode;
        if (!currentElement) {
            return false;
        }
    }
    return matched;
}
function matchMultipleSelector(allSelectors, element) {
    let match = false;
    for (const selector of allSelectors) {
       match = matchSingleSelector(selector, element);
       if (!match) { return match; }
    }
    return match;
}

function matchSingleSelector(selector, element) {
    if (selector.startsWith('.')) {
        return element.classList.contains(selector.replace('.', ''));
    } else if (selector.startsWith('#')) {
        return element.id === selector.replace('#', '')
    } else {
        return element.localName === selector;
    }
}
function getAllSelector(selector) {
    const regex=/(#\w+)|(.\w+)|(\w+)/g;
     return selector.match(regex);
}

console.log(match("div #main.head", document.getElementById("main")));