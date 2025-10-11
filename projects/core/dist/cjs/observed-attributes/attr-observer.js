"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attrObserver = void 0;
const attrObserver = (componentInstance, attrName, callback, transformer) => {
    const component = componentInstance;
    component.addObservedAttr(attrName, callback, transformer || null);
};
exports.attrObserver = attrObserver;
