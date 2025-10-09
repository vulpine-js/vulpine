export const watch = (componentInstance, valueCaller, callback) => {
    const component = componentInstance;
    component.addWatcher({
        isConnected: () => component.isConnected,
        valueCaller,
        evaluate: (newValue, oldValue) => newValue !== oldValue,
        update(newValue, oldValue) {
            callback(newValue, oldValue);
        },
    });
};
