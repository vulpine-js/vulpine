"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSharedState = void 0;
const createSharedState = (value) => {
    let allPropsComponents = [];
    const state = {};
    let savedValue = value;
    Object.defineProperty(state, 'addComponent', {
        value: (component) => {
            allPropsComponents.push(component);
        },
        enumerable: false,
        writable: false,
        configurable: false,
    });
    Object.defineProperty(state, 'value', {
        get() {
            return savedValue;
        },
        set(newValue) {
            if (newValue !== savedValue) {
                savedValue = newValue;
                if (allPropsComponents.length > 0) {
                    let hasDisconnected = false;
                    for (let i = 0; i < allPropsComponents.length; i++) {
                        const comp = allPropsComponents[i];
                        if (comp.isConnected) {
                            comp.detectChanges();
                        }
                        else {
                            hasDisconnected = true;
                        }
                    }
                    if (hasDisconnected) {
                        allPropsComponents = allPropsComponents.filter(comp => comp.isConnected);
                    }
                }
            }
        },
    });
    return (componentInstance) => {
        allPropsComponents.push(componentInstance);
        return state;
    };
};
exports.createSharedState = createSharedState;
