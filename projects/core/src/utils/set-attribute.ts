const propertyMap: Record<string, string> = {
  value: 'value',
  checked: 'checked',
  selected: 'selected',
  selectedindex: 'selectedIndex',
  open: 'open',
  disabled: 'disabled',
  readonly: 'readOnly',
  novalidate: 'noValidate',
  currenttime: 'currentTime',
  volume: 'volume',
  muted: 'muted',
  autoplay: 'autoplay',
  for: 'htmlFor',
  width: 'width',
  height: 'height',
};

export const setAttribute = (element: Element, key: string, value: string) => {
  const k = key.toLowerCase();
  if (propertyMap[k]) {
    // assign to known property on HTMLElement when available
    const el = element as HTMLElement & Record<string, unknown>;
    el[propertyMap[k]] = value as unknown;
  } else {
    element.setAttribute(key, value);
  }
};
