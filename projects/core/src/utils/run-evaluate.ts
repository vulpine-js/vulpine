import { SavedRouteInterface } from '../interfaces/saved-route.interface';
import evaluateSavedRoutes from './evaluate-saved-routes';

const runEvaluate = (routes: SavedRouteInterface[], path: string) => {
  const { toDeactivate, toActivate } = evaluateSavedRoutes(routes, path);

  toDeactivate.forEach((deactivate) => deactivate());
  toActivate.forEach((activate) => activate());
};

export default runEvaluate;
