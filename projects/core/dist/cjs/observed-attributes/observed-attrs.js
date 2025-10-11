"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observedAttrs = void 0;
const observedAttrs = (fn, attributes) => {
    fn.observedAttrs = attributes;
};
exports.observedAttrs = observedAttrs;
