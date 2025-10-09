import { FnComponentType } from "../types/fn-component.type";

export const component = (fn: FnComponentType, name: string) => {
  fn.selector = name;
};