import { FnComponentType } from "../types/fn-component.type";

export const customElement = (fn: FnComponentType, extendClass: CustomElementConstructor, localName: keyof HTMLElementTagNameMap) => {
  fn.extends = extendClass;
  fn.localName = localName;
};
