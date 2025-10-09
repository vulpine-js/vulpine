import { normalizePath } from "./normalize-path";
import { SingletonRouter } from "./singleton-router";
export const viewRoute = (componentInstance, fnComponent, props = {}) => {
    const comment = document.createComment(' Route ');
    const fragment = document.createDocumentFragment();
    const router = new SingletonRouter();
    fragment.appendChild(comment);
    const toSaveRoute = {
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
