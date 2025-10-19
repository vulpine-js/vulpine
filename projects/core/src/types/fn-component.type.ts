import { FnDirectiveType } from './fn-directive.type';

type FnComponentIncompleteType = (
  props: Record<string, unknown>,
) => HTMLElement | DocumentFragment | Element;

interface FnComponentIncompleteInterface extends FnComponentIncompleteType {
  selector?: string;
  defined?: boolean;
  directives?: FnDirectiveType[];
  observedAttrs?: string[];
  extends?: CustomElementConstructor;
  localName?: keyof HTMLElementTagNameMap;
}

export type FnComponentType = FnComponentIncompleteInterface;
