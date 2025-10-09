import { ComponentInterface } from "../interfaces/component.interface";

export const createEventEmitter = <T = void>() => {
  type Listener = (payload: T) => void;
  // const listeners = new Set<Listener>();
  const listenersMap = new Map<ComponentInterface, Listener[]>();

  return function(componentInstance: any) {
    const component: ComponentInterface = componentInstance;

    if (!listenersMap.has(component)) {
      listenersMap.set(component, []);
    }

    return {
      subscribe(listener: Listener) {
        const listeners = listenersMap.get(component);
        if (listeners) {
          listeners.push(listener);
          listenersMap.set(component, listeners);
        }
        return {
          unsubscribe: () => {
            const listeners = listenersMap.get(component);
            if (listeners) {
              listenersMap.set(component, listeners.filter(item => item !== listener));
            }
          }
        };
      },
      publish(payload: T) {
        for (const [key, value] of listenersMap) {
          if (key.isConnected) {
            value.forEach(callback => callback(payload));
          } else {
            listenersMap.delete(key);
          }
        }
      },
      clear(componentInstance: any) {
        listenersMap.delete(componentInstance);
      },
      clearAll() {
        listenersMap.clear();
      },
    };
  }
};
