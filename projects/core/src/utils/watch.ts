import { ComponentInterface } from '../interfaces/component.interface';

export const watch = <T = unknown>(
  componentInstance: ComponentInterface,
  valueCaller: () => T,
  callback: (newValue: T, oldValue: T) => void,
) => {
  const component = componentInstance;
  component.addWatcher<T>({
    isConnected: () => component.isConnected,
    valueCaller,
    evaluate: (newValue, oldValue) => newValue !== oldValue,
    update(newValue, oldValue) {
      callback(newValue, oldValue);
    },
  });
};
