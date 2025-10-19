import { ComponentInterface } from '../interfaces/component.interface';

export const connected = (componentInstance: ComponentInterface, callback: () => void) => {
  const component = componentInstance;
  component.addConnectedHook(callback);
};
