"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.component = void 0;
const component = (fn, name) => {
    fn.selector = name;
};
exports.component = component;
