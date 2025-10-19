import { ComponentInterface } from '../interfaces/component.interface';

type ValidatorType<AllFormValues> = (value?: unknown, formValues?: AllFormValues) => string | null;

type FormControlType<Value, T> = [Value, ValidatorType<T>[]?];

interface FakeStateInterface<T = unknown> {
  value: T;
  errors: string[];
  hasChanged: boolean;
}

export const formGroup = <T = Record<string, unknown>>(
  componentInstance: ComponentInterface,
  config: { [K in keyof T]: FormControlType<T[K], T> },
) => {
  const component: ComponentInterface = componentInstance;

  type StatesType = { [K in keyof T]: FakeStateInterface<T[K]> };

  const keys = Object.keys(config) as (keyof T)[];
  const states: StatesType = {} as unknown as StatesType;

  const getValues = (): T => {
    const values = {} as T;
    const ks = Object.keys(states) as (keyof T)[];
    for (let i = 0; i < ks.length; i++) {
      const k: keyof T = ks[i];
      values[k] = (states[k] as FakeStateInterface<unknown>).value as T[keyof T];
    }
    return values;
  };

  const fakeState = <Value = unknown>(
    componentInstance: ComponentInterface,
    value: Value,
    name: keyof T,
    validators: ValidatorType<T>[],
  ): FakeStateInterface<Value> => {
    const component = componentInstance;
    const state: Partial<FakeStateInterface<Value>> = {
      errors: [],
      hasChanged: false,
    };
    let savedValue: Value = value as Value;

    Object.defineProperty(state, 'value', {
      get() {
        return savedValue;
      },
      set(newValue: Value) {
        if (newValue !== savedValue) {
          savedValue = newValue;
          (states[name] as FakeStateInterface<unknown>).hasChanged = true;
          runValidation<Value>(validators, newValue, name);
          component.detectChanges();
        }
      },
      enumerable: true,
      configurable: true,
    });

    return state as FakeStateInterface<Value>;
  };

  const runValidation = <Value>(validators: ValidatorType<T>[], value: Value, name: keyof T) => {
    const controlErrors = validators
      .map((validator) => validator(value as unknown, getValues()))
      .filter((result) => !!result) as string[];
    states[name].errors = controlErrors;
  };

  for (let i = 0; i < keys.length; i++) {
    const key: keyof T = keys[i];
    const value = config[key][0];
    const validators = config[key][1] || [];
    const typedValue = value as unknown as T[typeof key];
    states[key] = fakeState(component, typedValue, key, validators) as FakeStateInterface<
      T[typeof key]
    >;
  }

  for (let i = 0; i < keys.length; i++) {
    const key: keyof T = keys[i];
    const value = config[key][0];
    const validators = config[key][1] || [];
    const typedValue = value as unknown as T[typeof key];
    runValidation(validators, typedValue, key);
  }

  Object.defineProperty(states, 'values', {
    get() {
      return getValues();
    },
    enumerable: true,
  });

  return states as StatesType & { values: T };
};
