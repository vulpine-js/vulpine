import { ComponentInterface } from '../interfaces/component.interface';

export const disconnected = (componentInstance: ComponentInterface, callback: () => void) => {
  const component = componentInstance;
  component.addDisconnectedHook(callback);
};
