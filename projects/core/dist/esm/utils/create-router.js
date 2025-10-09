import { SingletonRouter } from "./singleton-router";
import { vulpineValidationΘ } from "./vulpine-validation";
export function createRouter(componentInstance) {
    const component = componentInstance;
    const routerCls = new SingletonRouter();
    const router = {};
    router.navigate = routerCls.navigate.bind(routerCls);
    router.canActivate = routerCls.canActivate.bind(routerCls);
    router.canDeactivate = routerCls.canDeactivate.bind(routerCls);
    router.onRouteChange = (callback) => {
        vulpineValidationΘ(() => {
            if (!component) {
                throw new Error('Component instance should be passed to the createRouter function to subscribe to route change event. Ex. createRouter(this)');
            }
        });
        routerCls.addSubscription({
            isConnected: () => component.isConnected,
            callback,
        });
    };
    Object.defineProperty(router, 'params', {
        get() {
            var _a;
            vulpineValidationΘ(() => {
                if (!component) {
                    throw new Error('Component instance should be passed to the createRouter function to get params. Ex. createRouter(this)');
                }
            });
            return ((_a = component.getMetaData('router')) === null || _a === void 0 ? void 0 : _a.params) || {};
        }
    });
    return router;
}
