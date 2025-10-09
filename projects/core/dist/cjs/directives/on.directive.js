"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDirective = void 0;
const add_event_listener_1 = require("../utils/add-event-listener");
const directive_1 = require("./directive");
const onDirective = (element, directives) => {
    let events = {};
    for (let i = 0; i < directives.length; i++) {
        const dir = directives[i];
        if (!events[dir.name]) {
            events[dir.name] = [];
        }
        events[dir.name].push(dir.valueCaller);
    }
    (0, add_event_listener_1.addEventListener)(element, events);
    return element;
};
exports.onDirective = onDirective;
(0, directive_1.directive)(exports.onDirective, 'on');
