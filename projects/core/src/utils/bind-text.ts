import { ComponentInterface } from '../interfaces/component.interface';

export const bindText = <T = unknown>(
  componentInstance: ComponentInterface,
  valueCaller: () => T,
) => {
  const component = componentInstance;
  const textNode = document.createTextNode('');
  component.addWatcher({
    isConnected: () => textNode.isConnected,
    valueCaller,
    evaluate: (newValue, oldValue) => newValue !== oldValue,
    update: (newValue: T) => {
      const v = newValue as unknown;
      textNode.nodeValue = v == null ? '' : String(v);
    },
  });
  return textNode;
};
