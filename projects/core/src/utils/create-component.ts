import { ComponentInterface } from "../interfaces/component.interface";
import { StateInterface } from "../interfaces/state.interface";
import { FnComponentType } from "../types/fn-component.type";
import { define } from "./define";

export const createComponent = (componentInstance: any, fnComponent: FnComponentType, props: Record<string, StateInterface> = {}): HTMLElement => {
  const parentComponent: ComponentInterface = componentInstance;

  if (!fnComponent.selector) {
    throw new Error('Component does not have a selector');
  }

  define(fnComponent);
  const component = customElements.get(fnComponent.selector);
  const newComponent = new component!(props);

  parentComponent.addChild(newComponent as unknown as ComponentInterface);

  return newComponent;
};
