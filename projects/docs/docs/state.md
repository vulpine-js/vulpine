# Local State and Shared State

## Local State

```tsx
export function Button() {
  const counter = state(this, 0);
  return <button on:click={counter.value += 1}>Increment : {counter.value}</button>
}

component(Button, 'app-button');
```

## Shared State
```ts
export const counterState = sharedState(123);
```

```tsx
export function SharedStateParent() {
  const counter = counterState(this);
  return <div>
    <h3>Shared State Parent</h3>
    <p>parent shared state : {counter.value}</p>
    <button on:click={counter.value += 1}>Update from parent</button>

    <SharedStateChild />
  </div>
}

component(SharedStateParent, 'app-shared-state-parent');
```

```tsx
export function SharedStateChild() {
  const counter = counterState(this);

  return <div>
    <h3>Shared State Child</h3>
    <p>child shared state : {counter.value}</p>
    <button on:click={counter.value += 1}>Update from child</button>
  </div>
}

component(SharedStateChild, 'app-shared-state-child');
```