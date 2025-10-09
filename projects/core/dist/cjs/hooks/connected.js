"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connected = void 0;
const connected = (componentInstance, callback) => {
    const component = componentInstance;
    component.addConnectedHook(callback);
};
exports.connected = connected;
