import { ComponentInterface } from '../interfaces/component.interface';
import { StateInterface } from '../interfaces/state.interface';
import { WatcherInterface } from '../interfaces/watcher.interface';
import { FnComponentType } from '../types/fn-component.type';
import { FnDirectiveType } from '../types/fn-directive.type';
import { HooksInterface } from '../interfaces/hooks.interface';
import defaultDirectives from './default-directives';
import runWatcher from './run-watcher';

const define = (fnInput: FnComponentType) => {
  const fn = fnInput;
  if (!fn.selector) return;

  const webComponent = class extends (fn.extends || HTMLElement) implements ComponentInterface {
    private directives: FnDirectiveType[] = fn.directives || [];

    private watchers: WatcherInterface[] = [];

    private conditionalWatchers: WatcherInterface[] = [];

    private runChangeDetection: boolean = true;

    private isAfterChangeDetectionRunning: boolean = false;

    private hooks: HooksInterface = {
      connected: [],
      disconnected: [],
      beforeChangeDetection: [],
      afterChangeDetection: [],
      afterViewInit: [],
      attributeChanged: [],
      adopted: [],
    };

    private childComponents: ComponentInterface[] = [];

    private readonly element: HTMLElement;

    private metaData: Record<string, any> = {};

    public initialChangeDetectionRunning: boolean = false;

    public initialChangeDetectionDone: boolean = false;

    public runWatcher = runWatcher;

    constructor(props: Record<string, StateInterface>) {
      super();

      this.applyDefaultDirectives();
      this.element = fn.bind(this)(props);
    }

    connectedCallback() {
      this.runHooks('connected');
      this.appendChild(this.element);
      this.initialChangeDetectionRunning = true;
      this.runDetectChanges();
      this.initialChangeDetectionRunning = false;
      this.initialChangeDetectionDone = true;
      this.runHooks('afterViewInit');
    }

    disconnectedCallback() {
      this.runHooks('disconnected');
    }

    /**
     * Observed attributes =================================================
     */
    private observedAttrs: {
      name: string | null;
      callback?: (newVal: any, oldVal: any) => void;
      callbackAll?: (attrName: string, newVal: any, oldVal: any) => void;
      transformer?: ((value: any) => any) | null;
    }[] = [];

    public addObservedAttr(
      name: string | null,
      callback: (newVal: any, oldVal: any) => void,
      transformer: ((value: string) => any) | null,
    ) {
      this.observedAttrs.push({
        name,
        callback,
        transformer,
      });
    }

    public addObservedAttrAll(callback: (attrName: string, newVal: any, oldVal: any) => void) {
      this.observedAttrs.push({
        name: null,
        callbackAll: callback,
        transformer: null,
      });
    }

    static get observedAttributes() {
      return fn.observedAttrs || [];
    }

    attributeChangedCallback(attrName: string, oldValue: string, newValue: string) {
      this.runHooks('afterViewInit', attrName, oldValue, newValue);

      if (this.observedAttrs.length) return;

      for (let i = 0; i < this.observedAttrs.length; i += 1) {
        const { name, callback, callbackAll, transformer } = this.observedAttrs[i];
        if (name === attrName || name === null) {
          let newValueHolder = newValue;
          let oldValueHolder = oldValue;

          if (transformer) {
            newValueHolder = newValueHolder ? transformer(newValueHolder) : newValueHolder;
            oldValueHolder = oldValueHolder ? transformer(oldValueHolder) : oldValueHolder;
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

    public adoptedCallback() {
      this.runHooks('adopted');
    }

    public getMetaData(key: string) {
      return this.metaData[key];
    }

    public addMetaData(data: Record<string, any>) {
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

    public addHook(hookName: keyof HooksInterface, callback: () => void) {
      this.hooks[hookName].push(callback);
    }

    private runHooks(hookName: keyof HooksInterface, ...attrs: string[]) {
      if (hookName === 'attributeChanged') {
        this.hooks[hookName].forEach((hook) => hook(...attrs));
      } else {
        this.hooks[hookName].forEach((hook) => hook());
      }
    }

    // HOOK
    private beforeChangeDetection() {
      if (this.isAfterChangeDetectionRunning) return;
      this.runChangeDetection = false;

      this.runHooks('beforeChangeDetection');

      this.runChangeDetection = true;
    }

    // HOOK
    private afterChangeDetection() {
      if (this.isAfterChangeDetectionRunning) return;

      this.isAfterChangeDetectionRunning = true;

      this.runHooks('afterChangeDetection');

      this.isAfterChangeDetectionRunning = false;
    }

    public addWatcher(watcher: WatcherInterface, isConditional: boolean = false) {
      if (isConditional) {
        this.conditionalWatchers.push(watcher);
      } else {
        this.watchers.push(watcher);
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
    customElements.define(fn.selector, webComponent, { extends: fn.localName || undefined });
  }
};

export default define;
