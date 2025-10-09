export interface WatcherInterface {
  value?: any;
  evaluate: (newValue: any, oldValue: any) => boolean; // return true if there are changes
  isConnected: () => boolean;
  valueCaller: () => any;
  update: (newValue: any, oldValue: any) => void;
}
