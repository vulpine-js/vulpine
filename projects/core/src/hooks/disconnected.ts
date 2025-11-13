import { ComponentInterface } from '../interfaces/component.interface';

export const disconnected = (componentInstance: any, callback: () => void) => {
  const component = componentInstance as ComponentInterface;
  component.addHook('disconnected', callback);
};

export default disconnected;
