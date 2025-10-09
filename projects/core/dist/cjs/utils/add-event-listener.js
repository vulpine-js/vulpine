"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEventListener = void 0;
const applyEvent = (element, events, prevent) => {
    for (const eventType in events) {
        const handlers = events[eventType];
        if (!handlers || handlers.length === 0)
            continue;
        for (let i = 0; i < handlers.length; i++) {
            const handler = handlers[i];
            if (prevent) {
                element.addEventListener(eventType, (e) => {
                    e.preventDefault();
                    handler(e);
                }, false);
            }
            else {
                element.addEventListener(eventType, handler, false);
            }
        }
    }
};
const addEventListener = (element, events, preventEvents = {}) => {
    applyEvent(element, events || {}, false);
    applyEvent(element, preventEvents || {}, false);
    return element;
};
exports.addEventListener = addEventListener;
