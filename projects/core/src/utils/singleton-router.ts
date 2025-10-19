import { GuardInterface } from '../interfaces/guard.interface';
import { NavigateOptionsInterface } from '../interfaces/navigation-options.interface';
import { SavedRouteInterface } from '../interfaces/saved-route.interface';
import { evaluateRoute } from './evaluate-route';
import { normalizePath } from './normalize-path';
import { vulpineValidationΘ } from './vulpine-validation';

export class SingletonRouter {
  public static instance: SingletonRouter;
  public isRedirectingFromGuard: boolean = false;
  public guardRedirectUrls: {
    path: string;
    options: NavigateOptionsInterface;
  }[] = [];
  public currentRoute = this.getBrowserRoute();

  private savedRoutes: SavedRouteInterface[] = [];
  private guards: GuardInterface[] = [];
  private subscriptions: {
    isConnected: () => boolean;
    callback: () => void;
  }[] = [];

  constructor() {
    if (SingletonRouter.instance) {
      return SingletonRouter.instance;
    }

    SingletonRouter.instance = this;
  }

  public getBrowserRoute() {
    return window.location.href.replace(window.location.origin, '');
  }

  public canActivate<T = unknown>(guard: GuardInterface<T>) {
    const currentPath = normalizePath(window.location.pathname);
    const { shouldActivate } = evaluateRoute(currentPath, guard.path);
    this.guards.push({
      ...guard,
      type: 'active',
      isActive: shouldActivate,
    } as GuardInterface);
  }

  public canDeactivate<T = unknown>(guard: GuardInterface<T>) {
    const currentPath = normalizePath(window.location.pathname);
    const { shouldActivate } = evaluateRoute(currentPath, guard.path);
    this.guards.push({
      ...guard,
      type: 'deactivate',
      isActive: shouldActivate,
    } as GuardInterface);
  }

  public saveRoute(route: SavedRouteInterface) {
    this.savedRoutes.push(route);
  }

  public addSubscription(subscription: { isConnected: () => boolean; callback: () => void }) {
    this.subscriptions.push(subscription);
  }

  private evaluate(savedRoutes: SavedRouteInterface[], newPath: string) {
    const toActivate: (() => void)[] = [];
    const toDeactivate: (() => void)[] = [];
    savedRoutes.forEach((route) => {
      const result = evaluateRoute(newPath, route.pathCaller());
      if (route.isActivated && result.shouldDeactivate) {
        toDeactivate.push(() => {
          route.isActivated = false;
          route.element?.remove();
          route.element = null;
        });
      } else if (!route.isActivated && result.shouldActivate) {
        toActivate.push(() => {
          route.isActivated = true;
          route.element = route.elementCaller();
          this.setRouterParams(route.element, result.routeParams);
          route.commentElement.after(route.element);
        });
      } else if (route.isActivated && result.shouldActivate) {
        this.setRouterParams(route.element, result.routeParams);
      }
    });
    return {
      toDeactivate,
      toActivate,
    };
  }

  private setRouterParams(element: Element | null, params: Record<string, unknown>) {
    if (!element) return;

    // Only call addMetaData on elements that implement the Component-like API
    interface CompLike {
      addMetaData?: (data: Record<string, unknown>) => void;
    }
    const maybeComp = element as unknown as CompLike;
    if (typeof maybeComp.addMetaData === 'function') {
      maybeComp.addMetaData({ router: { params } });
    }
  }

  public async runEvaluate(routes: SavedRouteInterface[], path: string) {
    const { toDeactivate, toActivate } = this.evaluate(routes, path);

    toDeactivate.forEach((deactivate) => deactivate());
    toActivate.forEach((activate) => activate());
  }

  private async evaluateGuards(path: string): Promise<boolean> {
    const routeGuardChanges: (() => void)[] = [];

    let prevent = false;
    for (let i = 0; i < this.guards.length; i++) {
      const guard = this.guards[i];
      if (guard.type === 'deactivate') {
        const { shouldDeactivate, shouldActivate, routeParams } = evaluateRoute(path, guard.path);
        if (shouldDeactivate && guard.isActive && !prevent) {
          let data: unknown;
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
          let data: unknown;
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

  public async navigate(path: string, options: NavigateOptionsInterface = {}) {
    if (this.isRedirectingFromGuard) {
      this.guardRedirectUrls.push({
        path,
        options,
      });
      return;
    }

    const pathname = this.getBrowserRoute();
    const currentPath = normalizePath(pathname);
    const newPath = normalizePath(path);
    if (currentPath === newPath) return;
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

    this.subscriptions.forEach((subscription) => {
      if (subscription.isConnected()) {
        subscription.callback();
      }
    });

    this.subscriptions = this.subscriptions.filter((subscription) => subscription.isConnected());
    this.savedRoutes = this.savedRoutes.filter((route) => route.commentElement.isConnected);

    this.guardRedirectUrls = [];

    const { state = {}, replace = false } = options;
    if (replace) {
      history.replaceState(state, '', newPath);
    } else {
      history.pushState(state, '', newPath);
    }
  }
}
