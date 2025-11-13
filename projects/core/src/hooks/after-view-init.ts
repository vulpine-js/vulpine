import { ComponentInterface } from '../interfaces/component.interface';

const afterViewInit = (componentInstance: any, callback: () => void) => {
  const component = componentInstance as ComponentInterface;
  component.addHook('afterViewInit', callback);
};

export default afterViewInit;
