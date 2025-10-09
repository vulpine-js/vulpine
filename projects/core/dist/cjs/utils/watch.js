"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = void 0;
const watch = (componentInstance, valueCaller, callback) => {
    const component = componentInstance;
    component.addWatcher({
        isConnected: () => component.isConnected,
        valueCaller,
        evaluate: (newValue, oldValue) => newValue !== oldValue,
        update(newValue, oldValue) {
            callback(newValue, oldValue);
        },
    });
};
exports.watch = watch;
