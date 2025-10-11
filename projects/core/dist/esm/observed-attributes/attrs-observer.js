export const attrsObserver = (componentInstance, callback) => {
    const component = componentInstance;
    component.addObservedAttrAll(callback);
};
