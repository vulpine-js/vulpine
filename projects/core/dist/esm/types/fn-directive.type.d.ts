import { ComponentInterface } from "../interfaces/component.interface";
import { DirectiveInterface } from "../interfaces/directive.interface";
type FnDirectiveIncompleteType = (element: Element, directives: DirectiveInterface[], component?: ComponentInterface) => Element;
interface FnDirectiveIncompleteInterface extends FnDirectiveIncompleteType {
    namespace?: string;
}
export type FnDirectiveType = FnDirectiveIncompleteInterface;
export {};
