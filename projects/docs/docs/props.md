# Props

## State props

State props can be updated via the child component

```tsx
interface Props {
    counter: StateInterface<number>;
}
export function Child({ counter }: Props) {
    return <p>Counter : {counter.value}</p>
}

component(Child, 'app-child');
```

```tsx
export function Parent() {
    const counter = state(0);
    return <Child counter={counter}></Child>
}

component(Parent, 'app-parent');
```

## String props

```tsx
interface Props {
    counter: string;
}
export function Child({ counter }: Props) {
    return <p>Counter : {counter}</p>
}

component(Child, 'app-child');
```

```tsx
export function Parent() {
    return <Child counter="100"></Child>
}

component(Parent, 'app-parent');
```

## Normal variable props

```tsx
interface Props {
    counter: string;
}
export function Child({ counter }: Props) {
    return <p>Counter : {counter}</p>
}

component(Child, 'app-child');
```

```tsx
export function Parent() {
    const counter = 100;
    return <Child counter={counter}></Child>
}

component(Parent, 'app-parent');
```