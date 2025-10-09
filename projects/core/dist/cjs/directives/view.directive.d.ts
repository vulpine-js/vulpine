import { ComponentInterface } from "../interfaces/component.interface";
import { DirectiveInterface } from "../interfaces/directive.interface";
export declare const handleModel: (element: Element, valueCaller: DirectiveInterface["valueCaller"], component: ComponentInterface) => void;
export declare const viewDirective: (element: Element, directives: DirectiveInterface[], componentInstance?: ComponentInterface) => Element;
