import { GuardInterface } from "../interfaces/guard.interface";
import { NavigateOptionsInterface } from "../interfaces/navigation-options.interface";
interface RouterInterface {
    navigate: (path: string, options?: NavigateOptionsInterface) => void;
    params: Record<string, string>;
    onRouteChange: (callback: () => void) => void;
    canActivate: (guard: GuardInterface) => void;
    canDeactivate: (guard: GuardInterface) => void;
}
export declare function createRouter(componentInstance?: any): RouterInterface;
export {};
