import { ComponentInterface } from '../interfaces/component.interface';
import { StateInterface } from '../interfaces/state.interface';

export const createState = <T = unknown>(
  componentInstance: ComponentInterface,
  value: T,
): StateInterface<T> => {
  const component = componentInstance;
  const state: Partial<StateInterface<T>> = {};
  let savedValue: T = value;

  Object.defineProperty(state, 'value', {
    get() {
      return savedValue;
    },
    set(newValue: T) {
      if (newValue !== savedValue) {
        savedValue = newValue;
        component.detectChanges();
      }
    },
    enumerable: true,
    configurable: true,
  });

  return state as StateInterface<T>;
};
