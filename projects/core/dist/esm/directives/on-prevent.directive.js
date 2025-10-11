import { addEventListener } from "../utils/add-event-listener";
import { directive } from "./directive";
export const onPreventDirective = (element, directives) => {
    let events = {};
    for (let i = 0; i < directives.length; i++) {
        const dir = directives[i];
        if (!events[dir.name]) {
            events[dir.name] = [];
        }
        events[dir.name].push(dir.valueCaller);
    }
    addEventListener(element, {}, events);
    return element;
};
directive(onPreventDirective, 'on-prevent');
