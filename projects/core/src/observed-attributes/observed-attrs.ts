import { FnComponentType } from "../types/fn-component.type";

export const observedAttrs = (fn: FnComponentType, attributes: string[]) => {
  fn.observedAttrs = attributes;
};
