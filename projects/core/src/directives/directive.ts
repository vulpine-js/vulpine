import { FnDirectiveType } from '../types/fn-directive.type';

export const directive = (fnDirective: FnDirectiveType, namespace: string) => {
  fnDirective.namespace = namespace;
};
