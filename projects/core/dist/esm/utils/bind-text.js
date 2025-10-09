export const bindText = (componentInstance, valueCaller) => {
    const component = componentInstance;
    const textNode = document.createTextNode('');
    component.addWatcher({
        isConnected: () => textNode.isConnected,
        valueCaller,
        evaluate: (newValue, oldValue) => newValue !== oldValue,
        update: (newValue) => {
            textNode.nodeValue = newValue;
        },
    });
    return textNode;
};
