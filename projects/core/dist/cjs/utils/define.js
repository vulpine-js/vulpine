"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.define = void 0;
const default_directives_1 = require("./default-directives");
const define = (fn) => {
    if (!fn.selector)
        return;
    const webComponent = class extends HTMLElement {
        constructor(props) {
            super();
            this.directives = fn.directives || [];
            this.watchers = [];
            this.conditionalWatchers = [];
            this.runChangeDetection = true;
            this.connectedHooks = [];
            this.disconnectedHooks = [];
            this.childComponents = [];
            this.metaData = {};
            this.initialChangeDetectionRunning = false;
            this.initialChangeDetectionDone = false;
            /**
             * Observed attributes =================================================
             */
            this.observedAttrs = [];
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
        addObservedAttr(name, callback, transformer) {
            this.observedAttrs.push({
                name,
                callback,
                transformer
            });
        }
        addObservedAttrAll(callback) {
            this.observedAttrs.push({
                name: null,
                callbackAll: callback,
                transformer: null
            });
        }
        static get observedAttributes() {
            return fn.observedAttrs || [];
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            if (!this.observedAttrs.length)
                return;
            for (let i = 0; i < this.observedAttrs.length; i++) {
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
                    }
                    else if (callbackAll) {
                        callbackAll(attrName, newValueHolder, oldValueHolder);
                    }
                }
            }
        }
        /**
         * [end] Observed attributes =================================================
         */
        getMetaData(key) {
            return this.metaData[key];
        }
        addMetaData(data) {
            this.metaData = {
                ...this.metaData,
                ...data
            };
        }
        applyDefaultDirectives() {
            this.directives = [
                ...this.directives,
                ...default_directives_1.defaultDirectives,
            ];
        }
        addChild(component) {
            this.childComponents.push(component);
        }
        getDirective(namespace) {
            return this.directives.find(dir => dir.namespace === namespace);
        }
        addDisconnectedHook(callback) {
            this.disconnectedHooks.push(callback);
        }
        addConnectedHook(callback) {
            this.connectedHooks.push(callback);
        }
        // HOOK
        connected() {
            this.connectedHooks.forEach(hook => hook());
        }
        // HOOK
        disconnected() {
            this.disconnectedHooks.forEach(hook => hook());
        }
        // HOOK
        afterViewInit() { }
        // HOOK
        beforeChangeDetection() {
            this.runChangeDetection = false;
            // run beforeChangeDetection hooks in here
            this.runChangeDetection = true;
        }
        // HOOK
        afterChangeDetection() {
            this.runChangeDetection = false;
            // run afterChangeDetection hooks in here
            this.runChangeDetection = true;
        }
        addWatcher(watcher, isConditional = false) {
            if (isConditional) {
                this.conditionalWatchers.push(watcher);
            }
            else {
                this.watchers.push(watcher);
            }
        }
        runWatcher(watcher) {
            const oldValue = watcher.value;
            const newValue = watcher.valueCaller();
            if (watcher.evaluate(newValue, oldValue)) {
                watcher.update(newValue, oldValue);
                watcher.value = newValue;
            }
        }
        runDetectChanges() {
            [...this.conditionalWatchers].reverse().forEach(watcher => this.runWatcher(watcher));
            this.watchers.forEach(watcher => this.runWatcher(watcher));
            this.childComponents.forEach(child => child.detectChanges());
            this.childComponents = this.childComponents.filter(child => child.isConnected);
            this.removeUnusedWatchers();
        }
        removeUnusedWatchers() {
            this.watchers = this.watchers.filter(watcher => watcher.isConnected());
            this.conditionalWatchers = this.conditionalWatchers.filter(watcher => watcher.isConnected());
        }
        detectChanges() {
            if (!this.runChangeDetection)
                return;
            this.beforeChangeDetection();
            this.runDetectChanges();
            this.afterChangeDetection();
        }
    };
    if (!fn.defined) {
        fn.defined = true;
        if (customElements.get(fn.selector))
            return;
        customElements.define(fn.selector, webComponent);
    }
};
exports.define = define;
