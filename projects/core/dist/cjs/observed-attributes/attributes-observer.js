"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attributesObserver = void 0;
const attributesObserver = (componentInstance, callback) => {
    const component = componentInstance;
    component.addObservedAttr(null, callback, null);
};
exports.attributesObserver = attributesObserver;
