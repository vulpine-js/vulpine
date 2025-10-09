"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kebabToCamel = void 0;
const kebabToCamel = (str) => {
    const camel = str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    return camel.charAt(0).toLowerCase() + camel.slice(1);
};
exports.kebabToCamel = kebabToCamel;
