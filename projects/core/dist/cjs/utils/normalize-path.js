"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePath = void 0;
const normalizePath = (url, removeQueryAndHash = false) => {
    if (removeQueryAndHash) {
        const pathname = new URL(url, 'http://dummy.base').pathname;
        return pathname.replace(/\/+$/, '') || '/';
    }
    return url.replace(/\/+$/, '') || '/';
};
exports.normalizePath = normalizePath;
