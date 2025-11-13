import { ComponentInterface } from '../interfaces/component.interface';

const afterChangeDetection = (componentInstance: any, callback: () => void) => {
  const component = componentInstance as ComponentInterface;
  component.addHook('afterChangeDetection', callback);
};

export default afterChangeDetection;
