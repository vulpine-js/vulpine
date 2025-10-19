import { ComponentInterface } from '../interfaces/component.interface';
import { DirectiveInterface } from '../interfaces/directive.interface';
import { directive } from './directive';

export const classDirective = (
  element: Element,
  directives: DirectiveInterface[],
  componentInstance?: ComponentInterface,
) => {
  const component = componentInstance as ComponentInterface;

  for (let i = 0; i < directives.length; i++) {
    const dir = directives[i];
    component.addWatcher({
      isConnected: () => element.isConnected,
      valueCaller: () => Boolean(dir.valueCaller()),
      evaluate: (newValue, oldValue) => newValue !== oldValue,
      update: (newValue: unknown) => {
        if (newValue) {
          element.classList.add(dir.name);
        } else {
          element.classList.remove(dir.name);
        }
      },
    });
  }

  return element;
};

directive(classDirective, 'class');
