import { directive } from "./directive";
import { handleModel } from "./view.directive";
export const formDirective = (element, directives, componentInstance) => {
    const component = componentInstance;
    for (let i = 0; i < directives.length; i++) {
        const dir = directives[i];
        switch (dir.name) {
            case 'control':
                handleModel(element, dir.valueCaller, component);
                break;
        }
    }
    return element;
};
directive(formDirective, 'form');
