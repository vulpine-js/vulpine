import type { FnDirectiveType } from '../types/fn-directive.type';
import { HooksInterface } from './hooks.interface';
import { WatcherInterface } from './watcher.interface';

export interface ComponentInterface extends HTMLElement {
  addWatcher: (watcher: WatcherInterface, isConditional?: boolean) => void;
  addChild: (component: ComponentInterface) => void;
  detectChanges: () => void;
  addHook: (hookName: keyof HooksInterface, callback: (...attrs: string[]) => void) => void;
  addObservedAttr: (
    name: string | null,
    callback: (newVal: any, oldVal: any) => void,
    transformer: ((value: string) => any) | null,
  ) => void;
  addObservedAttrAll: (callback: (attrName: string, newVal: any, oldVal: any) => void) => void;
  getDirective: (namespace: string) => FnDirectiveType | undefined;
  runWatcher: (watcher: WatcherInterface) => void;
  addMetaData: (data: Record<string, any>) => void;
  getMetaData: (key: string) => any;
  isConnected: boolean;
  initialChangeDetectionDone: boolean;
  initialChangeDetectionRunning: boolean;
}
