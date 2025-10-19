import { FnDirectiveType } from '../types/fn-directive.type';
import { WatcherInterface } from './watcher.interface';

export interface ComponentInterface extends HTMLElement {
  addWatcher: <T = unknown>(watcher: WatcherInterface<T>, isConditional?: boolean) => void;
  addChild: (component: ComponentInterface) => void;
  detectChanges: () => void;
  addConnectedHook: (callback: () => void) => void;
  addObservedAttr: (
    name: string | null,
    callback: (newVal: unknown, oldVal: unknown) => void,
    transformer: ((value: string) => unknown) | null,
  ) => void;
  addObservedAttrAll: (
    callback: (attrName: string, newVal: unknown, oldVal: unknown) => void,
  ) => void;
  addDisconnectedHook: (callback: () => void) => void;
  getDirective: (namespace: string) => FnDirectiveType | undefined;
  runWatcher: (watcher: WatcherInterface) => void;
  addMetaData: (data: Record<string, unknown>) => void;
  getMetaData: (key: string) => unknown;
  isConnected: boolean;
  initialChangeDetectionDone: boolean;
  initialChangeDetectionRunning: boolean;
}
