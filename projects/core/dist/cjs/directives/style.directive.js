"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.styleDirective = void 0;
const kebab_to_camel_1 = require("../utils/kebab-to-camel");
const directive_1 = require("./directive");
const styleDirective = (element, directives, componentInstance) => {
    const component = componentInstance;
    for (let i = 0; i < directives.length; i++) {
        const dir = directives[i];
        component.addWatcher({
            isConnected: () => element.isConnected,
            valueCaller: dir.valueCaller,
            evaluate: (newValue, oldValue) => newValue !== oldValue,
            update: (newValue) => {
                element.style[(0, kebab_to_camel_1.kebabToCamel)(dir.name)] = newValue;
            }
        });
    }
    return element;
};
exports.styleDirective = styleDirective;
(0, directive_1.directive)(exports.styleDirective, 'style');
