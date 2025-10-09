import { directive } from "./directive";
export const classDirective = (element, directives, componentInstance) => {
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
directive(classDirective, 'class');
