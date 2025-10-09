import { setAttribute } from "./set-attribute";
export const bindAttribute = (componentInstance, element, attributes) => {
    const component = componentInstance;
    const keys = Object.keys(attributes);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        component.addWatcher({
            isConnected: () => element.isConnected,
            valueCaller: attributes[key],
            evaluate: (newValue, oldValue) => newValue !== oldValue,
            update: (newValue) => {
                setAttribute(element, key, newValue);
            },
        });
    }
    return element;
};
