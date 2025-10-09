"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomEvent = void 0;
const createCustomEvent = (componentInstance, eventName) => {
    const component = componentInstance;
    return (payload) => {
        component.dispatchEvent(new CustomEvent(eventName, {
            detail: payload
        }));
    };
};
exports.createCustomEvent = createCustomEvent;
