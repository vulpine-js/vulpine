"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAttribute = void 0;
const propertyMap = {
    value: 'value',
    checked: 'checked',
    selected: 'selected',
    selectedindex: 'selectedIndex',
    open: 'open',
    disabled: 'disabled',
    readonly: 'readOnly',
    novalidate: 'noValidate',
    currenttime: 'currentTime',
    volume: 'volume',
    muted: 'muted',
    autoplay: 'autoplay',
    for: 'htmlFor',
    width: 'width',
    height: 'height'
};
const setAttribute = (element, key, value) => {
    const k = key.toLowerCase();
    if (propertyMap[k]) {
        element[propertyMap[k]] = value;
    }
    else {
        element.setAttribute(key, value);
    }
};
exports.setAttribute = setAttribute;
