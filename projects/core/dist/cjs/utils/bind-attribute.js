"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindAttribute = void 0;
const set_attribute_1 = require("./set-attribute");
const bindAttribute = (componentInstance, element, attributes) => {
    const component = componentInstance;
    const keys = Object.keys(attributes);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        component.addWatcher({
            isConnected: () => element.isConnected,
            valueCaller: attributes[key],
            evaluate: (newValue, oldValue) => newValue !== oldValue,
            update: (newValue) => {
                (0, set_attribute_1.setAttribute)(element, key, newValue);
            },
        });
    }
    return element;
};
exports.bindAttribute = bindAttribute;
