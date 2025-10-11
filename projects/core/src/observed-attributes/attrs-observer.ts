import { ComponentInterface } from "../interfaces/component.interface";

export const attrsObserver = <T = any>(componentInstance: any, callback: (attrName: string, newVal: T, oldVal: T) => void) => {
  const component = componentInstance as ComponentInterface;
  component.addObservedAttrAll(callback);
};

