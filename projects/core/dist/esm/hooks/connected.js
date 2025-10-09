export const connected = (componentInstance, callback) => {
    const component = componentInstance;
    component.addConnectedHook(callback);
};
