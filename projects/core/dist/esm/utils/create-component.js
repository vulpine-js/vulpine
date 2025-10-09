import { define } from "./define";
export const createComponent = (componentInstance, fnComponent, props = {}) => {
    const parentComponent = componentInstance;
    if (!fnComponent.selector) {
        throw new Error('Component does not have a selector');
    }
    define(fnComponent);
    const component = customElements.get(fnComponent.selector);
    const newComponent = new component(props);
    parentComponent.addChild(newComponent);
    return newComponent;
};
