"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attrsObserver = void 0;
const attrsObserver = (componentInstance, callback) => {
    const component = componentInstance;
    component.addObservedAttrAll(callback);
};
exports.attrsObserver = attrsObserver;
