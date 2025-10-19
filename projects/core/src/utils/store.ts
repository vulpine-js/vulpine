import { ComponentInterface } from '../interfaces/component.interface';
import { deepCopy } from './deep-copy';

type ActionFns<S> = Record<string, (state: S, ...args: unknown[]) => S>;
type GetterFns<S> = Record<string, (state: S) => unknown>;

type StoreOptions<S, A extends ActionFns<S>, G extends GetterFns<S>> = {
  state: S;
  actions?: A;
  getters?: G;
};

type StoreReturn<S, A extends ActionFns<S>, G extends GetterFns<S>> = S & {
  [K in keyof A]: A[K] extends (state: S, ...args: infer P) => infer R ? (...args: P) => R : never;
} & {
  [K in keyof G]: G[K] extends (state: S) => infer R ? () => R : never;
};

export const createStore = <S extends object, A extends ActionFns<S>, G extends GetterFns<S>>(
  options: StoreOptions<S, A, G>,
) => {
  const components: ComponentInterface[] = [];

  const state: S = deepCopy(options.state) as S;
  const internalState: Record<string, unknown> = state as unknown as Record<string, unknown>;

  const getStateOnlyDeepCopy = (): S => {
    const newState: Partial<S> = {};
    Object.keys(options.state).forEach((key) => {
      (newState as Record<string, unknown>)[key] = (state as Record<string, unknown>)[key];
    });
    return deepCopy(newState) as S;
  };

  const assignKeys = (to: Record<string, unknown>, from: Record<string, unknown>) => {
    Object.keys(from).forEach((k) => {
      to[k] = from[k];
    });
  };

  // bind actions so state is first arg automatically
  const boundActions: Record<string, (...args: unknown[]) => unknown> = {};
  Object.entries(options.actions || {}).forEach(([key, fn]) => {
    boundActions[key] = (...args: unknown[]) => {
      const actionFn = fn as unknown as (state: S, ...a: unknown[]) => S;
      const newState: S = actionFn(getStateOnlyDeepCopy(), ...(args as unknown[]));
      assignKeys(internalState, newState as Record<string, unknown>);
      components.forEach((component) => component.detectChanges());
      return newState;
    };
  });

  // bind getters so state is passed automatically
  const boundGetters: Record<string, () => unknown> = {};
  Object.entries(options.getters || {}).forEach(([key, fn]) => {
    boundGetters[key] = () => (fn as unknown as (state: S) => unknown)(getStateOnlyDeepCopy());
  });

  Object.keys(boundActions).forEach((key) => {
    internalState[key] = boundActions[key];
  });
  Object.keys(boundGetters).forEach((key) => {
    internalState[key] = boundGetters[key];
  });

  return function (componentInstance?: ComponentInterface): StoreReturn<S, A, G> {
    if (componentInstance) {
      const component: ComponentInterface = componentInstance;
      components.push(component);
    }

    // Merge state with bound actions and getters into a single object
    const storeObj: Record<string, unknown> = { ...state } as Record<string, unknown>;
    assignKeys(storeObj, internalState);
    return storeObj as StoreReturn<S, A, G>;
  };
};
