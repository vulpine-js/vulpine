export const attributeObserver = (componentInstance, attrName, callback, transformer) => {
    const component = componentInstance;
    component.addObservedAttr(attrName, callback, transformer || null);
};
