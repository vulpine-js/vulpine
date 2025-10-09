import { FnComponentType } from "../types/fn-component.type";
import { FnDirectiveType } from "../types/fn-directive.type";

export const directives = (fnComponent: FnComponentType, directives: FnDirectiveType[]) => {
  fnComponent.directives = [...directives];
};
