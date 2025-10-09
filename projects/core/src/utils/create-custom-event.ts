import { ComponentInterface } from "../interfaces/component.interface";

export const createCustomEvent = <T = any>(componentInstance: any, eventName: string) => {
  const component: ComponentInterface = componentInstance;
  return (payload: T) => {
      component.dispatchEvent(new CustomEvent(eventName, {
        detail: payload
      }));
  };
};
