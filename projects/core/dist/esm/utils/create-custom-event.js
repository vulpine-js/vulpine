export const createCustomEvent = (componentInstance, eventName) => {
    const component = componentInstance;
    return (payload) => {
        component.dispatchEvent(new CustomEvent(eventName, {
            detail: payload
        }));
    };
};
