import { directive } from "./directive";
export const handleModel = (element, valueCaller, component) => {
    const model = valueCaller();
    component.addWatcher({
        isConnected: () => element.isConnected,
        evaluate: (newValue, oldValue) => newValue !== oldValue,
        update: (newValue) => {
            switch (element.localName) {
                case 'textarea':
                case 'input':
                    const input = element;
                    input.value = newValue;
                    break;
            }
        },
        valueCaller: () => model.value
    });
    switch (element.localName) {
        case 'textarea':
        case 'input':
            element.addEventListener('input', (event) => {
                model.value = event.target.value;
            });
            break;
    }
};
const handleRef = (element, directive) => {
    directive.valueCaller().value = element;
};
export const viewDirective = (element, directives, componentInstance) => {
    const component = componentInstance;
    for (let i = 0; i < directives.length; i++) {
        const dir = directives[i];
        switch (dir.name) {
            case 'model':
                handleModel(element, dir.valueCaller, component);
                break;
            case 'ref':
                handleRef(element, dir);
                break;
            default:
                throw new Error(`Directive ${dir.namespace}:${dir.name} is not defined`);
        }
    }
    return element;
};
directive(viewDirective, 'v');
