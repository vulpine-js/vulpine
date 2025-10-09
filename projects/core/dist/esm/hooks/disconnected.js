export const disconnected = (componentInstance, callback) => {
    const component = componentInstance;
    component.addConnectedHook(callback);
};
