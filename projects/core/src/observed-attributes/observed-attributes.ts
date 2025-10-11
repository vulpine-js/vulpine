import { FnComponentType } from "../types/fn-component.type";

export const observedAttributes = (fn: FnComponentType, attributes: string[]) => {
  fn.observedAttrs = attributes;
};
