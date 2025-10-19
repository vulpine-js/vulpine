import { ComponentInterface } from '../interfaces/component.interface';
import { DirectiveInterface } from '../interfaces/directive.interface';
import { StateInterface } from '../interfaces/state.interface';
import { directive } from './directive';

export const handleModel = (
  element: Element,
  valueCaller: DirectiveInterface['valueCaller'],
  component: ComponentInterface,
) => {
  const model: StateInterface<unknown> = valueCaller() as StateInterface<unknown>;
  component.addWatcher({
    isConnected: () => element.isConnected,
    evaluate: (newValue, oldValue) => newValue !== oldValue,
    update: (newValue) => {
      switch (element.localName) {
        case 'textarea':
        case 'input':
          const input = element as HTMLInputElement;
          input.value = String((newValue as unknown) ?? '');
          break;
      }
    },
    valueCaller: () => model.value,
  });

  switch (element.localName) {
    case 'textarea':
    case 'input':
      element.addEventListener('input', (event) => {
        model.value = (event.target as HTMLInputElement).value;
      });
      break;
  }
};

const handleRef = (element: Element, directive: DirectiveInterface) => {
  const target = directive.valueCaller();
  if (target && typeof target === 'object') {
    try {
      (target as { value?: unknown }).value = element;
    } catch (e) {
      // ignore assignment errors
    }
  }
};

export const viewDirective = (
  element: Element,
  directives: DirectiveInterface[],
  componentInstance?: ComponentInterface,
) => {
  const component = componentInstance as ComponentInterface;

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
