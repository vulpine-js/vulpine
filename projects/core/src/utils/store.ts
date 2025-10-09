import { ComponentInterface } from "../interfaces/component.interface";
import { deepCopy } from "./deep-copy";

type ActionFns<S> = Record<string, (state: S, ...args: any[]) => S>;
type GetterFns<S> = Record<string, (state: S) => any>;

type StoreOptions<S, A extends ActionFns<S>, G extends GetterFns<S>> = {
  state: S;
  actions?: A;
  getters?: G;
};

type StoreReturn<S, A extends ActionFns<S>, G extends GetterFns<S>> =
  S &
  {
    [K in keyof A]: A[K] extends (state: S, ...args: infer P) => infer R
      ? (...args: P) => R
      : never;
  } &
  {
    [K in keyof G]: G[K] extends (state: S) => infer R ? () => R : never;
  };

export const  createStore = <
  S extends object,
  A extends ActionFns<S>,
  G extends GetterFns<S>
>(options: StoreOptions<S, A, G>) => {
  const components: ComponentInterface[] = [];

  const state: any = deepCopy(options.state);

  const getStateOnlyDeepCopy = (): S => {
    const newState: any = {};
    Object.keys(options.state).forEach(key => {
      newState[key] = state[key];
    });
    return deepCopy(newState);
  }

  // bind actions so state is first arg automatically
  const boundActions = Object.fromEntries(
    Object.entries(options.actions || {}).map(([key, fn]) => [
      key,
      (...args: any[]) => {
        const newState: any = fn(getStateOnlyDeepCopy(), ...args);
        Object.keys(newState).forEach(key => {
          state[key] = newState[key];
        });
        components.forEach(component => component.detectChanges());
        return newState;
      }
    ])
  );

  // bind getters so state is passed automatically
  const boundGetters = Object.fromEntries(
    Object.entries(options.getters || {}).map(([key, fn]) => [
      key,
      () => fn(getStateOnlyDeepCopy()),
    ])
  );

  Object.keys(boundActions).forEach(key => {
    state[key] = boundActions[key];
  });
  Object.keys(boundGetters).forEach(key => {
    state[key] = boundGetters[key];
  });

  return function(componentInstance?: any): StoreReturn<S, A, G> {
    if (componentInstance) {
      const component: ComponentInterface = componentInstance;
      components.push(component);
    }

    return state as StoreReturn<S, A, G>;
  };
}
