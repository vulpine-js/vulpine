/* eslint-disable no-await-in-loop */
import { GuardInterface } from '../interfaces/guard.interface';
import { NavigateOptionsInterface } from '../interfaces/navigation-options.interface';
import { SavedRouteInterface } from '../interfaces/saved-route.interface';
import evaluateRoute from './evaluate-route';
import { normalizePath } from './normalize-path';
import { vulpineValidationΘ } from './vulpine-validation';
import getBrowserPath from './get-browser-path';
import runEvaluate from './run-evaluate';

class SingletonRouter {
  private static instance: SingletonRouter;

  public isRedirectingFromGuard: boolean = false;

  public guardRedirectUrls: { path: string; options: NavigateOptionsInterface }[] = [];

  public currentRoute = getBrowserPath();

  private savedRoutes: SavedRouteInterface[] = [];

  private guards: GuardInterface[] = [];

  private subscriptions: {
    isConnected: () => boolean;
    callback: () => void;
  }[] = [];

  constructor() {
    if (SingletonRouter.instance) {
      throw new Error('Use SingletonRouter.getInstance() instead of new.');
    }

    SingletonRouter.instance = this;
  }

  public static getInstance() {
    if (!SingletonRouter.instance) {
      SingletonRouter.instance = new SingletonRouter();
    }
    return SingletonRouter.instance;
  }

  public canActivate(guard: GuardInterface) {
    const currentPath = normalizePath(window.location.pathname);
    const { shouldActivate } = evaluateRoute(currentPath, guard.path, Boolean(guard.exact));
    this.guards.push({
      ...guard,
      type: 'active',
      isActive: shouldActivate,
    });
  }

  public canDeactivate(guard: GuardInterface) {
    const currentPath = normalizePath(window.location.pathname);
    const { shouldActivate } = evaluateRoute(currentPath, guard.path, Boolean(guard.exact));
    this.guards.push({
      ...guard,
      type: 'deactivate',
      isActive: shouldActivate,
    });
  }

  public saveRoute(route: SavedRouteInterface) {
    this.savedRoutes.push(route);
  }

  public addSubscription(subscription: { isConnected: () => boolean; callback: () => void }) {
    this.subscriptions.push(subscription);
  }

  private async evaluateGuards(path: string): Promise<boolean> {
    const routeGuardChanges: (() => void)[] = [];

    let prevent = false;
    for (let i = 0; i < this.guards.length; i += 1) {
      const guard = this.guards[i];
      if (guard.type === 'deactivate') {
        const { shouldDeactivate, shouldActivate, routeParams } = evaluateRoute(
          path,
          guard.path,
          Boolean(guard.exact),
        );
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

    for (let i = 0; i < this.guards.length; i += 1) {
      const guard = this.guards[i];
      if (guard.type === 'active') {
        const { shouldActivate, routeParams } = evaluateRoute(
          path,
          guard.path,
          Boolean(guard.exact),
        );
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

    for (let i = 0; i < routeGuardChanges.length; i += 1) {
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

    const pathname = getBrowserPath();
    const currentPath = normalizePath(pathname);
    const newPath = normalizePath(path);
    if (currentPath === newPath) return;
    this.currentRoute = newPath;

    const passed = await this.evaluateGuards(normalizePath(path, true));
    if (this.guardRedirectUrls.length > 0) {
      const { path: routePath, options: routeOptions } = this.guardRedirectUrls[0];
      this.guardRedirectUrls = [];
      this.navigate(routePath, routeOptions);
      return;
    }
    if (!passed) {
      return;
    }

    await runEvaluate(this.savedRoutes, normalizePath(newPath, true));

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
      window.history.replaceState(state, '', newPath);
    } else {
      window.history.pushState(state, '', newPath);
    }
  }
}

export default SingletonRouter;
