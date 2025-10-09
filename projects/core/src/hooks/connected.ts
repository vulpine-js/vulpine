import { ComponentInterface } from "../interfaces/component.interface";

export const connected = (componentInstance: any, callback: () => void) => {
  const component = componentInstance as ComponentInterface;
  component.addConnectedHook(callback);
};