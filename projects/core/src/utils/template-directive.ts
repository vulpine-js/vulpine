import { ComponentInterface } from "../interfaces/component.interface";
import { DirectiveInterface } from "../interfaces/directive.interface";

export const templateDirective = (componentInstance: any, element: Element, directives: DirectiveInterface[]) => {
  const component = componentInstance as ComponentInterface;
  const grouped: Record<string, DirectiveInterface[]> = {};
  for (let i = 0; i < directives.length; i++) {
    const dir = directives[i];
    if (!grouped[dir.namespace]) {
      grouped[dir.namespace] = [];
    }
    grouped[dir.namespace].push(dir);
  }

  const keys = Object.keys(grouped);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const dirs = grouped[key];
    const componentDirective = component.getDirective(key);
    if (componentDirective) {
      componentDirective(element, dirs, component);
    } else {
      throw new Error(`Directive ${key} is not defined`);
    }
  }

  return element;
};