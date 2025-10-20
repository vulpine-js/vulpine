import { SavedRouteInterface } from '../interfaces/saved-route.interface';
import { FnComponentType } from '../types/fn-component.type';
import { normalizePath } from './normalize-path';
import runEvaluate from './run-evaluate';
import SingletonRouter from './singleton-router';

const viewRoute = (
  componentInstance: unknown,
  fnComponent: FnComponentType,
  props: Record<string, () => any> = {},
) => {
  const comment = document.createComment(' Route ');
  const fragment = document.createDocumentFragment();
  const router = SingletonRouter.getInstance();

  fragment.appendChild(comment);

  const toSaveRoute: SavedRouteInterface = {
    pathCaller: props.path,
    elementCaller: props.element,
    exact: props.exact,
    isActivated: false,
    commentElement: comment,
    element: null,
  };

  router.saveRoute(toSaveRoute);

  runEvaluate([toSaveRoute], normalizePath(router.currentRoute, true));

  return fragment;
};

export default viewRoute;
