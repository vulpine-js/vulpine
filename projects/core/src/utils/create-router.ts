import { ComponentInterface } from '../interfaces/component.interface';
import { GuardInterface } from '../interfaces/guard.interface';
import { NavigateOptionsInterface } from '../interfaces/navigation-options.interface';
import SingletonRouter from './singleton-router';
import { vulpineValidationΘ } from './vulpine-validation';

interface RouterInterface {
  navigate: (path: string, options?: NavigateOptionsInterface) => void;
  params: Record<string, string>;
  onRouteChange: (callback: () => void) => void;
  canActivate: (guard: GuardInterface) => void;
  canDeactivate: (guard: GuardInterface) => void;
}

const createRouter = (componentInstance?: unknown) => {
  const component = componentInstance as ComponentInterface;
  const routerCls = SingletonRouter.getInstance();
  const router: RouterInterface = {} as unknown as RouterInterface;
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
      isConnected: () => component.isConnected,
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
      return component.getMetaData('router')?.params || {};
    },
  });

  return router;
};

export default createRouter;
