"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ifCondition = void 0;
const ifCondition = (componentInstance, elementCaller, valueCaller) => {
    const component = componentInstance;
    const fragment = document.createDocumentFragment();
    const comment = document.createComment(' IF ');
    let element = null;
    fragment.appendChild(comment);
    const watcher = {
        isConnected: () => comment.isConnected,
        valueCaller: () => Boolean(valueCaller()),
        evaluate: (newValue, oldValue) => newValue !== oldValue,
        update(newValue, oldValue) {
            if (newValue && !oldValue) {
                element = elementCaller();
                comment.after(element);
            }
            else if (!newValue && oldValue) {
                if (element) {
                    element.remove();
                    element = null;
                }
            }
        },
    };
    component.addWatcher(watcher, true);
    if (component.initialChangeDetectionDone) {
        component.runWatcher(watcher);
    }
    return fragment;
};
exports.ifCondition = ifCondition;
