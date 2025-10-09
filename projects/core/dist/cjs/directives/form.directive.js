"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formDirective = void 0;
const directive_1 = require("./directive");
const view_directive_1 = require("./view.directive");
const formDirective = (element, directives, componentInstance) => {
    const component = componentInstance;
    for (let i = 0; i < directives.length; i++) {
        const dir = directives[i];
        switch (dir.name) {
            case 'control':
                (0, view_directive_1.handleModel)(element, dir.valueCaller, component);
                break;
        }
    }
    return element;
};
exports.formDirective = formDirective;
(0, directive_1.directive)(exports.formDirective, 'form');
