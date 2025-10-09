"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directives = void 0;
const directives = (fnComponent, directives) => {
    fnComponent.directives = [...directives];
};
exports.directives = directives;
