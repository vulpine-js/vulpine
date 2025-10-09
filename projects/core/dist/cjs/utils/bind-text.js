"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindText = void 0;
const bindText = (componentInstance, valueCaller) => {
    const component = componentInstance;
    const textNode = document.createTextNode('');
    component.addWatcher({
        isConnected: () => textNode.isConnected,
        valueCaller,
        evaluate: (newValue, oldValue) => newValue !== oldValue,
        update: (newValue) => {
            textNode.nodeValue = newValue;
        },
    });
    return textNode;
};
exports.bindText = bindText;
