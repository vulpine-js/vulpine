"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStore = void 0;
const deep_copy_1 = require("./deep-copy");
const createStore = (options) => {
    const components = [];
    const state = (0, deep_copy_1.deepCopy)(options.state);
    const getStateOnlyDeepCopy = () => {
        const newState = {};
        Object.keys(options.state).forEach(key => {
            newState[key] = state[key];
        });
        return (0, deep_copy_1.deepCopy)(newState);
    };
    // bind actions so state is first arg automatically
    const boundActions = Object.fromEntries(Object.entries(options.actions || {}).map(([key, fn]) => [
        key,
        (...args) => {
            const newState = fn(getStateOnlyDeepCopy(), ...args);
            Object.keys(newState).forEach(key => {
                state[key] = newState[key];
            });
            components.forEach(component => component.detectChanges());
            return newState;
        }
    ]));
    // bind getters so state is passed automatically
    const boundGetters = Object.fromEntries(Object.entries(options.getters || {}).map(([key, fn]) => [
        key,
        () => fn(getStateOnlyDeepCopy()),
    ]));
    Object.keys(boundActions).forEach(key => {
        state[key] = boundActions[key];
    });
    Object.keys(boundGetters).forEach(key => {
        state[key] = boundGetters[key];
    });
    return function (componentInstance) {
        if (componentInstance) {
            const component = componentInstance;
            components.push(component);
        }
        return state;
    };
};
exports.createStore = createStore;
