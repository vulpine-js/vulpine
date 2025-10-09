import { ComponentInterface } from "../interfaces/component.interface";

export const disconnected = (componentInstance: any, callback: () => void) => {
  const component = componentInstance as ComponentInterface;
  component.addConnectedHook(callback);
};