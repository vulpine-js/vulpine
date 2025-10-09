"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnected = void 0;
const disconnected = (componentInstance, callback) => {
    const component = componentInstance;
    component.addConnectedHook(callback);
};
exports.disconnected = disconnected;
