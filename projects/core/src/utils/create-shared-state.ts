import { ComponentInterface } from "../interfaces/component.interface";
import { StateInterface } from "../interfaces/state.interface";

export const createSharedState = <T = any>(value: T) => {
  let allPropsComponents: ComponentInterface[] = [];
  const state = {};
  let savedValue: T = value;

  Object.defineProperty(state, 'addComponent', {
    value: (component: ComponentInterface) => {
      allPropsComponents.push(component);
    },
    enumerable: false,
    writable: false,
    configurable: false,
  });

  Object.defineProperty(state, 'value', {
    get() {
      return savedValue;
    },
    set(newValue: T) {
      if (newValue !== savedValue) {
        savedValue = newValue;
        if (allPropsComponents.length > 0) {
          let hasDisconnected = false;
          for (let i = 0; i < allPropsComponents.length; i++) {
            const comp = allPropsComponents[i];
            if (comp.isConnected) {
              comp.detectChanges();
            } else {
              hasDisconnected = true;
            }
          }

          if (hasDisconnected) {
            allPropsComponents = allPropsComponents.filter(comp => comp.isConnected);
          }
        }
      }
    },
  });

  return (componentInstance: any): StateInterface<T> => {
    allPropsComponents.push(componentInstance);

    return state as any;
  };
};
