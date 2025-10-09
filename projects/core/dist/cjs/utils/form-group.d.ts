type ValidatorType<AllFormValues> = (value?: any, formValues?: AllFormValues) => string | null;
type FormControlType<Value, T> = [Value, ValidatorType<T>[]?];
interface FakeStateInterface<T = any> {
    value: T;
    errors: string[];
    hasChanged: boolean;
}
export declare const formGroup: <T = any>(componentInstance: any, config: { [K_1 in keyof T]: FormControlType<T[K_1], T>; }) => { [K in keyof T]: FakeStateInterface<T[K]>; } & {
    values: T;
};
export {};
