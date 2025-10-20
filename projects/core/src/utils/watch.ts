import { ComponentInterface } from '../interfaces/component.interface';

const watch = <T = any>(
  componentInstance: any,
  valueCaller: () => T,
  callback: (newValue: T, oldValue: T) => void,
) => {
  const component: ComponentInterface = componentInstance;
  component.addWatcher({
    isConnected: () => component.isConnected,
    valueCaller,
    evaluate: (newValue, oldValue) => newValue !== oldValue,
    update(newValue, oldValue) {
      callback(newValue, oldValue);
    },
  });
};

export default watch;
