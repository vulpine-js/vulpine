import { ComponentInterface } from '../interfaces/component.interface';
import { setAttribute } from './set-attribute';

export const bindAttribute = <T = unknown>(
  componentInstance: ComponentInterface,
  element: Element,
  attributes: Record<string, () => T>,
) => {
  const component = componentInstance;
  const keys = Object.keys(attributes);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    component.addWatcher({
      isConnected: () => element.isConnected,
      valueCaller: attributes[key],
      evaluate: (newValue, oldValue) => newValue !== oldValue,
      update: (newValue: T) => {
        // coerce undefined/null to empty string and otherwise stringify
        const value = newValue == null ? '' : String(newValue);
        setAttribute(element, key, value);
      },
    });
  }

  return element;
};
