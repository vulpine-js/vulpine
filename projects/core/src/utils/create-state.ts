import { ComponentInterface } from '../interfaces/component.interface';
import { StateInterface } from '../interfaces/state.interface';

const createState = <T = any>(
  componentInstance: any,
  value: T,
  transformer?: (value: any) => T,
): StateInterface<T> => {
  const component = componentInstance as ComponentInterface;
  const state = {};
  let savedValue: any = transformer ? transformer(value) : value;

  Object.defineProperty(state, 'value', {
    get() {
      return savedValue;
    },
    set(newValue: T) {
      const transformed = transformer ? transformer(newValue) : newValue;
      if (transformed !== savedValue) {
        savedValue = transformed;
        component.detectChanges();
      }
    },
  });

  return state as any;
};

export default createState;
