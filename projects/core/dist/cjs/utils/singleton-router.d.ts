import { GuardInterface } from "../interfaces/guard.interface";
import { NavigateOptionsInterface } from "../interfaces/navigation-options.interface";
import { SavedRouteInterface } from "../interfaces/saved-route.interface";
export declare class SingletonRouter {
    static instance: SingletonRouter;
    isRedirectingFromGuard: boolean;
    guardRedirectUrls: {
        path: string;
        options: NavigateOptionsInterface;
    }[];
    currentRoute: string;
    private savedRoutes;
    private guards;
    private subscriptions;
    constructor();
    getBrowserRoute(): string;
    canActivate(guard: GuardInterface): void;
    canDeactivate(guard: GuardInterface): void;
    saveRoute(route: SavedRouteInterface): void;
    addSubscription(subscription: {
        isConnected: () => boolean;
        callback: () => void;
    }): void;
    private evaluate;
    private setRouterParams;
    runEvaluate(routes: SavedRouteInterface[], path: string): Promise<void>;
    private evaluateGuards;
    navigate(path: string, options?: NavigateOptionsInterface): Promise<void>;
}
