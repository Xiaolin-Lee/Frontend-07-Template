function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }

    for (let prop in element.computedStyle) {
        element.style[prop] = element.computedStyle[prop];
        if (element.style[prop].toString().match(/px$/)){
            element.style[prop] = parseInt(element.style[prop]);
        } else if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }

    return element.style;
}

function setDefaultStyle(style, prop, defaultValue) {
    if (!style[prop] || style[prop] === 'auto') {
        style[prop] = defaultValue;
    }
}

function layout(element){
    if (!element.computedStyle || Object.keys(element.computedStyle).length === 0) {
        return;
    }

    const elementStyle = getStyle(element);

    if (elementStyle.display !== 'flex') {
        return;
    }

    const children = element.children.filter(e => e.type === 'element');

    children.sort((a, b) => a.order||0 - b.order || 0);

    const style = elementStyle;

    ['width', 'height'].forEach(s => {
        if (style[s] === 'auto' || style[s] === '') {
            style[s] = null;
        }
    });
    setDefaultStyle(style, 'flexDirection', 'row');
    setDefaultStyle(style, 'alignItems', 'stretch');
    setDefaultStyle(style, 'justifyContent', 'flex-start');
    setDefaultStyle(style, 'flexWrap', 'nowrap');
    setDefaultStyle(style, 'alignContent', 'stretch');

    let mainSize, mainStart, mainEnd, mainBase, mainSign,
        crossSize, crossStart, crossEnd, crossBase, crossSign;
    if (style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }
    if (style.flexWrap === 'wrap-reverse') {
        let tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = +1;
    }

    let isAutoMainSize = false;
    if (!style[mainSize]) {
        elementStyle[mainSize] = 0;
        for (const child of children) {
            const childStyle = getStyle(child);
            if (!!childStyle[mainSize]) {
                elementStyle[mainSize] += childStyle[mainSize];
            }
        }

        isAutoMainSize = true;
    }

    let flexLine = [], flexLines = [flexLine];
    let mainSpace = elementStyle[mainSize], crossSpace=0;
    for (const child of children) {
        let childStyle = getStyle(child);
        if (!childStyle[mainSize]) {
            childStyle[mainSize] = 0;
        }

        if (childStyle.display === 'flex') {
            flexLine.push(child);
        } else if (childStyle.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= childStyle[mainSize];
            if (childStyle[crossSize] !== null && childStyle[crossSign] !== undefined) {
                crossSpace = Math.max(crossSpace, childStyle[crossSize]);
            }
            flexLine.push(child);
        } else {
            if (childStyle[mainSize] > style[mainSize]) {
                childStyle[mainSize] = style[mainSize];
            }

            if (mainSpace < childStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [child];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(child);
            }

            if (childStyle[crossSize] !== null && childStyle[crossSize] !== undefined) {
                crossSpace = Math.max(crossSpace, childStyle[crossSize]);
            }

            mainSpace -= childStyle[mainSize];
        }
    }
    flexLine.mainSpace = mainSpace;

    if (style.flexWrap==='nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSign] !== undefined ? style[crossSize] : crossSpace)
    } else {
        flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) {
        let scale = style[mainSize] / (style[mainSize] - mainSpace);
        let currentMain = mainBase;
        for (const child of children) {
            const childStyle = getStyle(child);
            if (childStyle.flex) {
                childStyle[mainSize] = 0;
            }

            childStyle[mainSize] *= scale;
            childStyle[mainStart] = currentMain;
            childStyle[mainEnd] = childStyle[mainStart] + mainSign + childStyle[mainSize];
            currentMain = childStyle[mainEnd];
        }
    }
    else {
        flexLines.forEach(items => {
            const mainSpace = items.mainSpace;
            let flexTotal = 0;
            for (const item of items) {
                const itemStyle = getStyle(item);

                if (!!itemStyle.flex) {
                    flexTotal += itemStyle.flex;
                }
            }

            if (flexTotal > 0) {
                let currentMain = mainBase;
                for (const item of items) {
                    const itemStyle = getStyle(item);

                    if (!!itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }

                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                let currentMain;
                let step;

                if (style.justifyContent === 'flex-start') {
                    currentMain = mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'flex-end') {
                    currentMain = mainSpace * mainSign + mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'center') {
                     currentMain = mainSpace / 2 * mainSign + mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'space-between') {
                     step = mainSpace / (items.length - 1) * mainSign;
                     currentMain = mainBase;
                }
                if (style.justifyContent === 'space-around') {
                     step = mainSpace / items.length * mainSign;
                     currentMain = step / 2 + mainBase;
                }

                for (let item of items) {
                    const itemStyle = getStyle(item);
                    itemStyle[mainStart]= currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                }
            }
        });
    }

    if (!style[crossSpace]){
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for (const fl of flexLines) {
            elementStyle[crossSize] += fl.crossSpace;
        }
    } else {
        crossSpace = style[crossSize];
        for (let i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace;
        }
    }

    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }

    let lineSize = style[crossSize] / flexLines.length;
    let step;

    if (style.alignContent === 'flex-start') {
        crossBase += 0;
        step = 0;
    }

    if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    }

    if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    }

    if (style.alignContent === 'space-between') {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    }

    if (style.alignContent === 'space-around') {
        step = crossSpace / (flexLines.length);
        crossBase += crossSign * step / 2;
    }

    if (style.alignContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }

    flexLines.forEach(function(items) {
        let lineCrossSize = style.alignContent === 'stretch' ?
            items.crossSpace + crossSpace / flexLines.length :
            items.crossSpace;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);

            let align = itemStyle.alignSelf || style.alignItems;

            if (item === null) {
                itemStyle[crossSize] = (align === 'stretch') ?
                    lineCrossSize : 0;
            }

            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }

            if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
            }

            if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }

            if (align === 'stretch') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize]) !== null && itemStyle[crossSize] !== (void 0) ? itemStyle[crossSize] : lineCrossSize);
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
            }
        }
        crossBase += crossSign * (lineCrossSize + step);
    });
}

module.exports = layout;

