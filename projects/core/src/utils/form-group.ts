import { ComponentInterface } from "../interfaces/component.interface";

type ValidatorType<AllFormValues> = (value?: any, formValues?: AllFormValues) => string | null;

type FormControlType<Value, T> = [Value,  ValidatorType<T>[]?];

interface FakeStateInterface<T = any> {
  value: T;
  errors: string[];
  hasChanged: boolean;
}

export const formGroup = <T = any>(componentInstance: any, config: { [K in keyof T]: FormControlType<T[K], T> }) => {
  const component: ComponentInterface = componentInstance;

  type StatesType = { [K in keyof T]: FakeStateInterface<T[K]>; };

  const keys = Object.keys(config) as (keyof T)[];
  const states: StatesType = {} as any;

  const fakeState = <Value = any>(componentInstance: any, value: Value, name: keyof T, validators: ValidatorType<T>[]): FakeStateInterface<Value> => {
    const component = componentInstance as ComponentInterface;
    const state = {
      errors: [],
      hasChanged: false,
    };
    let savedValue: any = value;

    Object.defineProperty(state, 'value', {
      get() {
        return savedValue;
      },
      set(newValue: Value) {
        if (newValue !== savedValue) {
          savedValue = newValue;
          states[name].hasChanged = true;
          runValidation<Value>(validators, newValue, name);
          component.detectChanges();
        }
      },
    });

    return state as any;
  };

  const runValidation = <Value>(validators: ValidatorType<T>[], value: Value, name: keyof T) => {
    const controlErrors = validators.map(validator => validator(value, (states as any).values)).filter(result => !!result) as string[];
    states[name].errors = controlErrors;
  };

  for (let i = 0; i < keys.length; i++) {
    const key: keyof T = keys[i];
    const value = config[key][0];
    const validators = config[key][1] || [];
    states[key] = fakeState(component, value, key, validators);
  }

  for (let i = 0; i < keys.length; i++) {
    const key: keyof T = keys[i];
    const value = config[key][0];
    const validators = config[key][1] || [];
    runValidation(validators, value, key);
  }

  Object.defineProperty(states, 'values', {
    get() {
      const values: T = {} as any;
      const keys = Object.keys(states) as (keyof T)[];
      for (let i = 0; i < keys.length; i++) {
        const key: keyof T = keys[i];
        values[key] = states[key].value;
      }
      return values;
    }
  });

  return states as StatesType & { values: T; };
}
