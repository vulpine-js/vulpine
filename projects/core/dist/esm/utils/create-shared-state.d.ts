import { StateInterface } from "../interfaces/state.interface";
export declare const createSharedState: <T = any>(value: T) => (componentInstance: any) => StateInterface<T>;
