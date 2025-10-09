"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formGroup = void 0;
const formGroup = (componentInstance, config) => {
    const component = componentInstance;
    const keys = Object.keys(config);
    const states = {};
    const fakeState = (componentInstance, value, name, validators) => {
        const component = componentInstance;
        const state = {
            errors: [],
            hasChanged: false,
        };
        let savedValue = value;
        Object.defineProperty(state, 'value', {
            get() {
                return savedValue;
            },
            set(newValue) {
                if (newValue !== savedValue) {
                    savedValue = newValue;
                    states[name].hasChanged = true;
                    runValidation(validators, newValue, name);
                    component.detectChanges();
                }
            },
        });
        return state;
    };
    const runValidation = (validators, value, name) => {
        const controlErrors = validators.map(validator => validator(value, states.values)).filter(result => !!result);
        states[name].errors = controlErrors;
    };
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = config[key][0];
        const validators = config[key][1] || [];
        states[key] = fakeState(component, value, key, validators);
    }
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = config[key][0];
        const validators = config[key][1] || [];
        runValidation(validators, value, key);
    }
    Object.defineProperty(states, 'values', {
        get() {
            const values = {};
            const keys = Object.keys(states);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                values[key] = states[key].value;
            }
            return values;
        }
    });
    return states;
};
exports.formGroup = formGroup;
