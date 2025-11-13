import { ComponentInterface } from '../interfaces/component.interface';

const adopted = (componentInstance: any, callback: () => void) => {
  const component = componentInstance as ComponentInterface;
  component.addHook('adopted', callback);
};

export default adopted;
