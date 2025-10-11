"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attributeObserver = void 0;
const attributeObserver = (componentInstance, attrName, callback, transformer) => {
    const component = componentInstance;
    component.addObservedAttr(attrName, callback, transformer || null);
};
exports.attributeObserver = attributeObserver;
