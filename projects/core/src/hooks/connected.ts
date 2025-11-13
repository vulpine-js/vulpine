import { ComponentInterface } from '../interfaces/component.interface';

const connected = (componentInstance: any, callback: () => void) => {
  const component = componentInstance as ComponentInterface;
  component.addHook('connected', callback);
};

export default connected;
