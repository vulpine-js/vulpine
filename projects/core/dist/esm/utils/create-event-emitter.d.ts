export declare const createEventEmitter: <T = void>() => (componentInstance: any) => {
    subscribe(listener: (payload: T) => void): {
        unsubscribe: () => void;
    };
    publish(payload: T): void;
    clear(componentInstance: any): void;
    clearAll(): void;
};
