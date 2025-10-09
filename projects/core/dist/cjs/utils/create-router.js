"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = createRouter;
const singleton_router_1 = require("./singleton-router");
const vulpine_validation_1 = require("./vulpine-validation");
function createRouter(componentInstance) {
    const component = componentInstance;
    const routerCls = new singleton_router_1.SingletonRouter();
    const router = {};
    router.navigate = routerCls.navigate.bind(routerCls);
    router.canActivate = routerCls.canActivate.bind(routerCls);
    router.canDeactivate = routerCls.canDeactivate.bind(routerCls);
    router.onRouteChange = (callback) => {
        (0, vulpine_validation_1.vulpineValidationΘ)(() => {
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
            (0, vulpine_validation_1.vulpineValidationΘ)(() => {
                if (!component) {
                    throw new Error('Component instance should be passed to the createRouter function to get params. Ex. createRouter(this)');
                }
            });
            return ((_a = component.getMetaData('router')) === null || _a === void 0 ? void 0 : _a.params) || {};
        }
    });
    return router;
}
