import { ComponentInterface } from "../interfaces/component.interface";

export const bindText = (componentInstance: any, valueCaller: () => any) => {
  const component = componentInstance as ComponentInterface;
  const textNode = document.createTextNode('');
  component.addWatcher({
    isConnected: () => textNode.isConnected,
    valueCaller,
    evaluate: (newValue, oldValue) => newValue !== oldValue,
    update: (newValue: any) => {
      textNode.nodeValue = newValue;
    },
  });
  return textNode;
};
