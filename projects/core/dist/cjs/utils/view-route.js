"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewRoute = void 0;
const normalize_path_1 = require("./normalize-path");
const singleton_router_1 = require("./singleton-router");
const viewRoute = (componentInstance, fnComponent, props = {}) => {
    const comment = document.createComment(' Route ');
    const fragment = document.createDocumentFragment();
    const router = new singleton_router_1.SingletonRouter();
    fragment.appendChild(comment);
    const toSaveRoute = {
        pathCaller: props.path,
        elementCaller: props.element,
        isActivated: false,
        commentElement: comment,
        element: null,
    };
    router.saveRoute(toSaveRoute);
    router.runEvaluate([toSaveRoute], (0, normalize_path_1.normalizePath)(router.currentRoute, true));
    return fragment;
};
exports.viewRoute = viewRoute;
