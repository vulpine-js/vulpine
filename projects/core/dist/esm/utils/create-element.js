function createElementByTagName(tagName) {
    const svgTags = new Set([
        'svg', 'circle', 'rect', 'path', 'line', 'polygon', 'polyline',
        'ellipse', 'g', 'defs', 'clipPath', 'use', 'text', 'tspan', 'foreignObject'
    ]);
    const mathTags = new Set(['math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac']);
    if (svgTags.has(tagName)) {
        return document.createElementNS('http://www.w3.org/2000/svg', tagName);
    }
    if (mathTags.has(tagName)) {
        return document.createElementNS('http://www.w3.org/1998/Math/MathML', tagName);
    }
    // Default: HTML element
    return document.createElement(tagName);
}
export const createElement = (type, attributes = {}, children = []) => {
    const el = createElementByTagName(type);
    for (const key in attributes) {
        if (Object.prototype.hasOwnProperty.call(attributes, key)) {
            el.setAttribute(key, attributes[key]);
        }
    }
    for (const child of children) {
        el.appendChild(child);
    }
    return el;
};
