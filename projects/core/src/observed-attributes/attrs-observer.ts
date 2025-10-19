import { ComponentInterface } from '../interfaces/component.interface';

export const attrsObserver = <T = unknown>(
  componentInstance: ComponentInterface | unknown,
  callback: (attrName: string, newVal: T, oldVal: T) => void,
) => {
  const component = componentInstance as ComponentInterface;
  component.addObservedAttrAll(((attrName: string, newVal: unknown, oldVal: unknown) =>
    callback(attrName, newVal as T, oldVal as T)) as (
    attrName: string,
    newVal: unknown,
    oldVal: unknown,
  ) => void);
};
