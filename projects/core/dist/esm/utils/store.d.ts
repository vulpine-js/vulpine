type ActionFns<S> = Record<string, (state: S, ...args: any[]) => S>;
type GetterFns<S> = Record<string, (state: S) => any>;
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
export declare const createStore: <S extends object, A extends ActionFns<S>, G extends GetterFns<S>>(options: StoreOptions<S, A, G>) => (componentInstance?: any) => StoreReturn<S, A, G>;
export {};
