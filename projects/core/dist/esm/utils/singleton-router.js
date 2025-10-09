import { evaluateRoute } from "./evaluate-route";
import { normalizePath } from "./normalize-path";
import { vulpineValidationΘ } from "./vulpine-validation";
export class SingletonRouter {
    constructor() {
        this.isRedirectingFromGuard = false;
        this.guardRedirectUrls = [];
        this.currentRoute = this.getBrowserRoute();
        this.savedRoutes = [];
        this.guards = [];
        this.subscriptions = [];
        if (SingletonRouter.instance) {
            return SingletonRouter.instance;
        }
        SingletonRouter.instance = this;
    }
    getBrowserRoute() {
        return window.location.href.replace(window.location.origin, '');
    }
    canActivate(guard) {
        const currentPath = normalizePath(window.location.pathname);
        const { shouldActivate } = evaluateRoute(currentPath, guard.path);
        this.guards.push({
            ...guard,
            type: 'active',
            isActive: shouldActivate
        });
    }
    canDeactivate(guard) {
        const currentPath = normalizePath(window.location.pathname);
        const { shouldActivate } = evaluateRoute(currentPath, guard.path);
        this.guards.push({
            ...guard,
            type: 'deactivate',
            isActive: shouldActivate
        });
    }
    saveRoute(route) {
        this.savedRoutes.push(route);
    }
    addSubscription(subscription) {
        this.subscriptions.push(subscription);
    }
    evaluate(savedRoutes, newPath) {
        const toActivate = [];
        const toDeactivate = [];
        savedRoutes.forEach(route => {
            const result = evaluateRoute(newPath, route.pathCaller());
            if (route.isActivated && result.shouldDeactivate) {
                toDeactivate.push(() => {
                    var _a;
                    route.isActivated = false;
                    (_a = route.element) === null || _a === void 0 ? void 0 : _a.remove();
                    route.element = null;
                });
            }
            else if (!route.isActivated && result.shouldActivate) {
                toActivate.push(() => {
                    route.isActivated = true;
                    route.element = route.elementCaller();
                    this.setRouterParams(route.element, result.routeParams);
                    route.commentElement.after(route.element);
                });
            }
            else if (route.isActivated && result.shouldActivate) {
                this.setRouterParams(route.element, result.routeParams);
            }
        });
        return {
            toDeactivate,
            toActivate,
        };
    }
    setRouterParams(element, params) {
        if (element && 'addMetaData' in element && typeof element.addMetaData === 'function') {
            element.addMetaData({
                router: {
                    params
                }
            });
        }
    }
    async runEvaluate(routes, path) {
        const { toDeactivate, toActivate } = this.evaluate(routes, path);
        toDeactivate.forEach(deactivate => deactivate());
        toActivate.forEach(activate => activate());
    }
    async evaluateGuards(path) {
        const routeGuardChanges = [];
        let prevent = false;
        for (let i = 0; i < this.guards.length; i++) {
            const guard = this.guards[i];
            if (guard.type === 'deactivate') {
                const { shouldDeactivate, shouldActivate, routeParams } = evaluateRoute(path, guard.path);
                if (shouldDeactivate && guard.isActive && !prevent) {
                    let data;
                    if (guard.resolve) {
                        data = await guard.resolve();
                    }
                    this.isRedirectingFromGuard = true;
                    const result = await guard.guard(data, routeParams || {});
                    this.isRedirectingFromGuard = false;
                    if (!result) {
                        prevent = true;
                    }
                }
                routeGuardChanges.push(() => {
                    guard.isActive = shouldActivate;
                });
            }
        }
        if (prevent) {
            vulpineValidationΘ(() => {
                if (this.guardRedirectUrls.length > 0) {
                    console.error('Cannot redirect when canDeactivate guard returns falsy value.');
                }
            });
            this.guardRedirectUrls = [];
            return false;
        }
        for (let i = 0; i < this.guards.length; i++) {
            const guard = this.guards[i];
            if (guard.type === 'active') {
                const { shouldActivate, routeParams } = evaluateRoute(path, guard.path);
                if (shouldActivate && !guard.isActive && !prevent) {
                    let data;
                    if (guard.resolve) {
                        data = await guard.resolve();
                    }
                    this.isRedirectingFromGuard = true;
                    const result = await guard.guard(data, routeParams || {});
                    this.isRedirectingFromGuard = false;
                    if (!result) {
                        prevent = true;
                    }
                }
                routeGuardChanges.push(() => {
                    guard.isActive = shouldActivate;
                });
            }
        }
        if (prevent) {
            return false;
        }
        for (let i = 0; i < routeGuardChanges.length; i++) {
            routeGuardChanges[i]();
        }
        return true;
    }
    async navigate(path, options = {}) {
        if (this.isRedirectingFromGuard) {
            this.guardRedirectUrls.push({
                path,
                options
            });
            return;
        }
        const pathname = this.getBrowserRoute();
        const currentPath = normalizePath(pathname);
        const newPath = normalizePath(path);
        if (currentPath === newPath)
            return;
        this.currentRoute = newPath;
        const passed = await this.evaluateGuards(normalizePath(path, true));
        if (this.guardRedirectUrls.length > 0) {
            const { path, options } = this.guardRedirectUrls[0];
            this.guardRedirectUrls = [];
            this.navigate(path, options);
            return;
        }
        if (!passed) {
            return;
        }
        await this.runEvaluate(this.savedRoutes, normalizePath(newPath, true));
        this.subscriptions.forEach(subscription => {
            if (subscription.isConnected()) {
                subscription.callback();
            }
        });
        this.subscriptions = this.subscriptions.filter(subscription => subscription.isConnected());
        this.savedRoutes = this.savedRoutes.filter(route => route.commentElement.isConnected);
        this.guardRedirectUrls = [];
        const { state = {}, replace = false } = options;
        if (replace) {
            history.replaceState(state, '', newPath);
        }
        else {
            history.pushState(state, '', newPath);
        }
    }
}
