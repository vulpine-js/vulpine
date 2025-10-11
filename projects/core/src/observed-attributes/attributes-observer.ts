import { ComponentInterface } from "../interfaces/component.interface";

export const attributesObserver = <T = any>(componentInstance: any, callback: (newVal: T, oldVal: T) => void) => {
  const component = componentInstance as ComponentInterface;
  component.addObservedAttr(null, callback, null);
};

