/**
 * Deep copies a value and recursively freezes it to make it immutable.
 */
export function deepCopy<T>(value: T): T {
  // If it's null or a primitive, return as-is
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Handle Date separately
  if (value instanceof Date) {
    return new Date(value.getTime()) as any;
  }

  // Handle Array
  if (Array.isArray(value)) {
    const copy = value.map((item) => deepCopy(item));
    return copy as any;
  }

  // Handle plain Object
  const copy: Record<string, any> = {};
  for (const [key, val] of Object.entries(value)) {
    copy[key] = deepCopy(val);
  }

  return copy as T;
}
