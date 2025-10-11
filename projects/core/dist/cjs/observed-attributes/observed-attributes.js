"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observedAttributes = void 0;
const observedAttributes = (fn, attributes) => {
    fn.observedAttrs = attributes;
};
exports.observedAttributes = observedAttributes;
