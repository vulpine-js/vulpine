import { ComponentInterface } from '../interfaces/component.interface';
import { StateInterface } from '../interfaces/state.interface';
import { FnComponentType } from '../types/fn-component.type';
import { define } from './define';
import { vulpineValidationΘ } from './vulpine-validation';

export const createComponent = (
  componentInstance: ComponentInterface,
  fnComponent: FnComponentType,
  props: Record<string, StateInterface> = {},
): HTMLElement => {
  const parentComponent: ComponentInterface = componentInstance;

  if (!fnComponent.selector) {
    throw new Error('Component does not have a selector');
  }

  define(fnComponent);

  if (fnComponent.extends) {
    vulpineValidationΘ(() => {
      if (Object.keys(props).length) {
        throw new Error('Custom element components can only have attributes and not properties.');
      }
    });
    return document.createElement(fnComponent.localName!, {
      is: fnComponent.selector,
    });
  } else {
    const ctor = customElements.get(fnComponent.selector) as unknown as
      | (new (props: Record<string, StateInterface>) => HTMLElement)
      | undefined;
    const newComponent = new (ctor as new (props: Record<string, StateInterface>) => HTMLElement)(
      props,
    ) as HTMLElement & ComponentInterface;
    parentComponent.addChild(newComponent as ComponentInterface);

    return newComponent;
  }
};
