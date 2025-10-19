import { ComponentInterface } from '../interfaces/component.interface';

export const attrObserver = <T = unknown>(
  componentInstance: ComponentInterface | unknown,
  attrName: string,
  callback: (newVal: T, oldVal: T) => void,
  transformer?: (value: string) => T,
) => {
  const component = componentInstance as ComponentInterface;
  component.addObservedAttr(
    attrName,
    ((newVal: unknown, oldVal: unknown) => callback(newVal as T, oldVal as T)) as (
      newVal: unknown,
      oldVal: unknown,
    ) => void,
    transformer || null,
  );
};
