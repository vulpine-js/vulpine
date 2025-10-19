export interface WatcherInterface<T = unknown> {
  value?: T;
  evaluate: (newValue: T, oldValue: T) => boolean; // return true if there are changes
  isConnected: () => boolean;
  valueCaller: () => T;
  update: (newValue: T, oldValue: T) => void;
}
