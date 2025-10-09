export interface WatcherInterface {
    value?: any;
    evaluate: (newValue: any, oldValue: any) => boolean;
    isConnected: () => boolean;
    valueCaller: () => any;
    update: (newValue: any, oldValue: any) => void;
}
