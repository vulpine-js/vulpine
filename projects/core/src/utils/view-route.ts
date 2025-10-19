import { SavedRouteInterface } from '../interfaces/saved-route.interface';
import { ComponentInterface } from '../interfaces/component.interface';
import { FnComponentType } from '../types/fn-component.type';
import { normalizePath } from './normalize-path';
import { SingletonRouter } from './singleton-router';

export const viewRoute = (
  componentInstance: ComponentInterface,
  fnComponent: FnComponentType,
  props: Record<string, () => unknown> & {
    path: () => string;
    element: () => Element;
  } = {
    path: () => '',
    element: () => document.createElement('div'),
  },
) => {
  const comment = document.createComment(' Route ');
  const fragment = document.createDocumentFragment();
  const router = new SingletonRouter();

  fragment.appendChild(comment);

  const toSaveRoute: SavedRouteInterface = {
    pathCaller: props.path,
    elementCaller: props.element,
    isActivated: false,
    commentElement: comment,
    element: null,
  };

  router.saveRoute(toSaveRoute);

  router.runEvaluate([toSaveRoute], normalizePath(router.currentRoute, true));

  return fragment;
};
