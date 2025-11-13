import { ComponentInterface } from '../interfaces/component.interface';

const beforeChangeDetection = (componentInstance: any, callback: () => void) => {
  const component = componentInstance as ComponentInterface;
  component.addHook('beforeChangeDetection', callback);
};

export default beforeChangeDetection;
