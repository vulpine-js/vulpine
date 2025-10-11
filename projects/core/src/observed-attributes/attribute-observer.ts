import { ComponentInterface } from "../interfaces/component.interface";

export const attributeObserver = <T = any>(componentInstance: any, attrName: string, callback: (newVal: T, oldVal: T) => void, transformer?: (value: string) => T) => {
  const component = componentInstance as ComponentInterface;
  component.addObservedAttr(attrName, callback, transformer || null);
};
