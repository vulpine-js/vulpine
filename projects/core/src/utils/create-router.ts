import { ComponentInterface } from '../interfaces/component.interface';
import { GuardInterface } from '../interfaces/guard.interface';
import { NavigateOptionsInterface } from '../interfaces/navigation-options.interface';
import { SingletonRouter } from './singleton-router';
import { vulpineValidationΘ } from './vulpine-validation';

interface RouterInterface {
  navigate: (path: string, options?: NavigateOptionsInterface) => void;
  params: Record<string, string>;
  onRouteChange: (callback: () => void) => void;
  canActivate: (guard: GuardInterface) => void;
  canDeactivate: (guard: GuardInterface) => void;
}

export function createRouter(componentInstance?: ComponentInterface) {
  const component: ComponentInterface | undefined = componentInstance;
  const routerCls = new SingletonRouter();
  const router: Partial<RouterInterface> = {};
  router.navigate = routerCls.navigate.bind(routerCls);
  router.canActivate = routerCls.canActivate.bind(routerCls);
  router.canDeactivate = routerCls.canDeactivate.bind(routerCls);
  router.onRouteChange = (callback: () => void) => {
    vulpineValidationΘ(() => {
      if (!component) {
        throw new Error(
          'Component instance should be passed to the createRouter function to subscribe to route change event. Ex. createRouter(this)',
        );
      }
    });
    routerCls.addSubscription({
      isConnected: () => !!component && component.isConnected,
      callback,
    });
  };

  Object.defineProperty(router, 'params', {
    get() {
      vulpineValidationΘ(() => {
        if (!component) {
          throw new Error(
            'Component instance should be passed to the createRouter function to get params. Ex. createRouter(this)',
          );
        }
      });
      const meta = component?.getMetaData('router');
      return (meta && (meta as { params?: Record<string, string> }).params) || {};
    },
  });

  return router;
}
