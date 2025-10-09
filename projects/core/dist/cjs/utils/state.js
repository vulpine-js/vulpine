"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = void 0;
const state = (componentInstance, value) => {
    const component = componentInstance;
    const state = {};
    let savedValue = value;
    Object.defineProperty(state, 'value', {
        get() {
            return savedValue;
        },
        set(newValue) {
            if (newValue !== savedValue) {
                savedValue = newValue;
                component.detectChanges();
            }
        },
    });
    return state;
};
exports.state = state;
