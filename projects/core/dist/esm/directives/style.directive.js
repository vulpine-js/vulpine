import { kebabToCamel } from "../utils/kebab-to-camel";
import { directive } from "./directive";
export const styleDirective = (element, directives, componentInstance) => {
    const component = componentInstance;
    for (let i = 0; i < directives.length; i++) {
        const dir = directives[i];
        component.addWatcher({
            isConnected: () => element.isConnected,
            valueCaller: dir.valueCaller,
            evaluate: (newValue, oldValue) => newValue !== oldValue,
            update: (newValue) => {
                element.style[kebabToCamel(dir.name)] = newValue;
            }
        });
    }
    return element;
};
directive(styleDirective, 'style');
