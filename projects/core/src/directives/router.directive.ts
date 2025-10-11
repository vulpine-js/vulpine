import { DirectiveInterface } from "../interfaces/directive.interface";
import { ComponentInterface } from "../interfaces/component.interface";
import { directive } from "./directive";
import { vulpineValidationΘ } from "../utils/vulpine-validation";
import { createRouter } from '../utils/create-router';
import { bindAttribute } from "../utils/bind-attribute";

export const routerDirective = (element: Element, directives: DirectiveInterface[], componentInstance?: ComponentInterface) => {
  const component = componentInstance as ComponentInterface;
  const router = createRouter();

  for (let i = 0; i < directives.length; i++) {
    const dir = directives[i];
    switch (dir.name) {
      case 'link':
        element.addEventListener('click', event => {
          event.preventDefault();
          router.navigate(dir.valueCaller());
        });
        if (element.localName === 'a') {
          bindAttribute(component, element, { href: () => dir.valueCaller() });
        }
        break;
      default:
        vulpineValidationΘ(() => {
          throw new Error(`Directive ${dir.namespace}:${dir.name} is not defined`);
        });
        break;
    }
  }

  return element;
};

directive(routerDirective, 'router');
