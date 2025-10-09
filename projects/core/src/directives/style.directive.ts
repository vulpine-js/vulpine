import { ComponentInterface } from "../interfaces/component.interface";
import { DirectiveInterface } from "../interfaces/directive.interface";
import { kebabToCamel } from "../utils/kebab-to-camel";
import { directive } from "./directive";

export const styleDirective = (element: Element, directives: DirectiveInterface[], componentInstance?: ComponentInterface) => {
  const component = componentInstance as ComponentInterface;

  for (let i = 0; i < directives.length; i++) {
    const dir = directives[i];
    component.addWatcher({
      isConnected: () => element.isConnected,
      valueCaller: dir.valueCaller,
      evaluate: (newValue, oldValue) => newValue !== oldValue,
      update: (newValue: any) => {
        ((element as HTMLElement).style as any)[kebabToCamel(dir.name)] = newValue;
      }
    });
  }

  return element;
};

directive(styleDirective, 'style');
