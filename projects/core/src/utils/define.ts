import { ComponentInterface } from '../interfaces/component.interface';
import { StateInterface } from '../interfaces/state.interface';
import { WatcherInterface } from '../interfaces/watcher.interface';
import { FnComponentType } from '../types/fn-component.type';
import { FnDirectiveType } from '../types/fn-directive.type';
import { defaultDirectives } from './default-directives';

export const define = (fn: FnComponentType) => {
  if (!fn.selector) return;

  const webComponent = class extends (fn.extends || HTMLElement) implements ComponentInterface {
    private directives: FnDirectiveType[] = fn.directives || [];
    private watchers: WatcherInterface<unknown>[] = [];
    private conditionalWatchers: WatcherInterface<unknown>[] = [];
    private runChangeDetection: boolean = true;
    private connectedHooks: (() => void)[] = [];
    private disconnectedHooks: (() => void)[] = [];
    private childComponents: ComponentInterface[] = [];
    private readonly element: HTMLElement | Element | DocumentFragment;
    private metaData: Record<string, unknown> = {};
    public initialChangeDetectionRunning: boolean = false;
    public initialChangeDetectionDone: boolean = false;

    constructor(props: Record<string, StateInterface>) {
      super();

      this.applyDefaultDirectives();
      this.element = fn.bind(this)(props);
    }

    connectedCallback() {
      this.connected();
      this.appendChild(this.element);
      this.initialChangeDetectionRunning = true;
      this.runDetectChanges();
      this.initialChangeDetectionRunning = false;
      this.initialChangeDetectionDone = true;
      this.afterViewInit();
    }

    disconnectedCallback() {
      this.disconnected();
    }

    /**
     * Observed attributes =================================================
     */
    private observedAttrs: {
      name: string | null;
      callback?: (newVal: unknown, oldVal: unknown) => void;
      callbackAll?: (attrName: string, newVal: unknown, oldVal: unknown) => void;
      transformer?: ((value: string) => unknown) | null;
    }[] = [];

    public addObservedAttr(
      name: string | null,
      callback: (newVal: unknown, oldVal: unknown) => void,
      transformer: ((value: string) => unknown) | null,
    ) {
      this.observedAttrs.push({
        name,
        callback,
        transformer,
      });
    }

    public addObservedAttrAll(
      callback: (attrName: string, newVal: unknown, oldVal: unknown) => void,
    ) {
      this.observedAttrs.push({
        name: null,
        callbackAll: callback,
        transformer: null,
      });
    }

    static get observedAttributes() {
      return fn.observedAttrs || [];
    }

    attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null) {
      if (!this.observedAttrs.length) return;

      for (let i = 0; i < this.observedAttrs.length; i++) {
        const { name, callback, callbackAll, transformer } = this.observedAttrs[i];
        if (name === attrName || name === null) {
          let newValueHolder: unknown = newValue;
          let oldValueHolder: unknown = oldValue;

          if (transformer) {
            if (newValueHolder != null) {
              newValueHolder = transformer(newValueHolder as string);
            }
            if (oldValueHolder != null) {
              oldValueHolder = transformer(oldValueHolder as string);
            }
          }

          if (callback) {
            callback(newValueHolder, oldValueHolder);
          } else if (callbackAll) {
            callbackAll(attrName, newValueHolder, oldValueHolder);
          }
        }
      }
    }
    /**
     * [end] Observed attributes =================================================
     */

    public getMetaData<T = unknown>(key: string): T | undefined {
      return this.metaData[key] as T | undefined;
    }

    public addMetaData(data: Record<string, unknown>) {
      this.metaData = {
        ...this.metaData,
        ...data,
      };
    }

    private applyDefaultDirectives() {
      this.directives = [...this.directives, ...defaultDirectives];
    }

    public addChild(component: ComponentInterface) {
      this.childComponents.push(component);
    }

    public getDirective(namespace: string) {
      return this.directives.find((dir) => dir.namespace === namespace);
    }

    public addDisconnectedHook(callback: () => void) {
      this.disconnectedHooks.push(callback);
    }

    public addConnectedHook(callback: () => void) {
      this.connectedHooks.push(callback);
    }

    // HOOK
    private connected() {
      this.connectedHooks.forEach((hook) => hook());
    }

    // HOOK
    private disconnected() {
      this.disconnectedHooks.forEach((hook) => hook());
    }

    // HOOK
    private afterViewInit() {}

    // HOOK
    private beforeChangeDetection() {
      this.runChangeDetection = false;

      // run beforeChangeDetection hooks in here

      this.runChangeDetection = true;
    }

    // HOOK
    private afterChangeDetection() {
      this.runChangeDetection = false;

      // run afterChangeDetection hooks in here

      this.runChangeDetection = true;
    }

    public addWatcher<T = unknown>(watcher: WatcherInterface<T>, isConditional: boolean = false) {
      // store as unknown internally to allow mixed generic watchers
      const w = watcher as WatcherInterface<unknown>;
      if (isConditional) {
        this.conditionalWatchers.push(w);
      } else {
        this.watchers.push(w);
      }
    }

    public runWatcher(watcher: WatcherInterface<unknown>) {
      const oldValue = watcher.value;
      const newValue = watcher.valueCaller();
      if (watcher.evaluate(newValue, oldValue)) {
        watcher.update(newValue, oldValue);
        watcher.value = newValue;
      }
    }

    private runDetectChanges() {
      [...this.conditionalWatchers].reverse().forEach((watcher) => this.runWatcher(watcher));
      this.watchers.forEach((watcher) => this.runWatcher(watcher));

      this.childComponents.forEach((child) => child.detectChanges());
      this.childComponents = this.childComponents.filter((child) => child.isConnected);

      this.removeUnusedWatchers();
    }

    private removeUnusedWatchers() {
      this.watchers = this.watchers.filter((watcher) => watcher.isConnected());
      this.conditionalWatchers = this.conditionalWatchers.filter((watcher) =>
        watcher.isConnected(),
      );
    }

    public detectChanges() {
      if (!this.runChangeDetection) return;

      this.beforeChangeDetection();

      this.runDetectChanges();

      this.afterChangeDetection();
    }
  };

  if (!fn.defined) {
    fn.defined = true;
    if (customElements.get(fn.selector)) return;
    customElements.define(fn.selector, webComponent, {
      extends: fn.localName || undefined,
    });
  }
};
