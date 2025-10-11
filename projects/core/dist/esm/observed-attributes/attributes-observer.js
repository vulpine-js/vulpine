export const attributesObserver = (componentInstance, callback) => {
    const component = componentInstance;
    component.addObservedAttr(null, callback, null);
};
