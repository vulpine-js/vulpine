import { ComponentInterface } from "../interfaces/component.interface";
import { setAttribute } from "./set-attribute";

export const bindAttribute = (componentInstance: any, element: Element, attributes: Record<string, () => any>) => {
  const component = componentInstance as ComponentInterface;
  const keys = Object.keys(attributes);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    component.addWatcher({
      isConnected: () => element.isConnected,
      valueCaller: attributes[key],
      evaluate: (newValue, oldValue) => newValue !== oldValue,
      update: (newValue: any) => {
        setAttribute(element, key, newValue);
      },
    });
  }

  return element;
};
