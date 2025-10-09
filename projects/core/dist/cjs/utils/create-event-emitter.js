"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventEmitter = void 0;
const createEventEmitter = () => {
    // const listeners = new Set<Listener>();
    const listenersMap = new Map();
    return function (componentInstance) {
        const component = componentInstance;
        if (!listenersMap.has(component)) {
            listenersMap.set(component, []);
        }
        return {
            subscribe(listener) {
                const listeners = listenersMap.get(component);
                if (listeners) {
                    listeners.push(listener);
                    listenersMap.set(component, listeners);
                }
                return {
                    unsubscribe: () => {
                        const listeners = listenersMap.get(component);
                        if (listeners) {
                            listenersMap.set(component, listeners.filter(item => item !== listener));
                        }
                    }
                };
            },
            publish(payload) {
                for (const [key, value] of listenersMap) {
                    if (key.isConnected) {
                        value.forEach(callback => callback(payload));
                    }
                    else {
                        listenersMap.delete(key);
                    }
                }
            },
            clear(componentInstance) {
                listenersMap.delete(componentInstance);
            },
            clearAll() {
                listenersMap.clear();
            },
        };
    };
};
exports.createEventEmitter = createEventEmitter;
