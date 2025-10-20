import { SavedRouteInterface } from '../interfaces/saved-route.interface';
import evaluateRoute from './evaluate-route';
import setComponentRouterParams from './set-component-router-params';

const evaluateSavedRoutes = (savedRoutes: SavedRouteInterface[], newPath: string) => {
  const toActivate: (() => void)[] = [];
  const toDeactivate: (() => void)[] = [];
  savedRoutes.forEach((route) => {
    const savedRoute = route;
    const result = evaluateRoute(
      newPath,
      savedRoute.pathCaller(),
      Boolean(route.exact ? route.exact() : false),
    );
    if (savedRoute.isActivated && result.shouldDeactivate) {
      toDeactivate.push(() => {
        savedRoute.isActivated = false;
        savedRoute.element?.remove();
        savedRoute.element = null;
      });
    } else if (!savedRoute.isActivated && result.shouldActivate) {
      toActivate.push(() => {
        savedRoute.isActivated = true;
        savedRoute.element = savedRoute.elementCaller();
        setComponentRouterParams(savedRoute.element, result.routeParams);
        savedRoute.commentElement.after(savedRoute.element);
      });
    } else if (savedRoute.isActivated && result.shouldActivate) {
      setComponentRouterParams(savedRoute.element, result.routeParams);
    }
  });
  return {
    toDeactivate,
    toActivate,
  };
};

export default evaluateSavedRoutes;
