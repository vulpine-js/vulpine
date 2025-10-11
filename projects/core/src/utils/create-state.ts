import { ComponentInterface } from "../interfaces/component.interface";
import { StateInterface } from "../interfaces/state.interface";

export const createState = <T = any>(componentInstance: any, value: T): StateInterface<T> => {
  const component = componentInstance as ComponentInterface;
  const state = {};
  let savedValue: any = value;

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
  });

  return state as any;
};
