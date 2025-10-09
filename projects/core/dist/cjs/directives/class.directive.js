"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classDirective = void 0;
const directive_1 = require("./directive");
const classDirective = (element, directives, componentInstance) => {
    const component = componentInstance;
    for (let i = 0; i < directives.length; i++) {
        const dir = directives[i];
        component.addWatcher({
            isConnected: () => element.isConnected,
            valueCaller: () => Boolean(dir.valueCaller()),
            evaluate: (newValue, oldValue) => newValue !== oldValue,
            update: (newValue) => {
                if (newValue) {
                    element.classList.add(dir.name);
                }
                else {
                    element.classList.remove(dir.name);
                }
            }
        });
    }
    return element;
};
exports.classDirective = classDirective;
(0, directive_1.directive)(exports.classDirective, 'class');
