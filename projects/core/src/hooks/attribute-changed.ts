import { ComponentInterface } from '../interfaces/component.interface';

const attributeChanged = (
  componentInstance: any,
  callback: (attrName: string, oldValue?: string, newValue?: string) => void,
) => {
  const component = componentInstance as ComponentInterface;
  component.addHook('attributeChanged', callback);
};

export default attributeChanged;
