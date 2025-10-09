"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComponent = void 0;
const define_1 = require("./define");
const createComponent = (componentInstance, fnComponent, props = {}) => {
    const parentComponent = componentInstance;
    if (!fnComponent.selector) {
        throw new Error('Component does not have a selector');
    }
    (0, define_1.define)(fnComponent);
    const component = customElements.get(fnComponent.selector);
    const newComponent = new component(props);
    parentComponent.addChild(newComponent);
    return newComponent;
};
exports.createComponent = createComponent;
