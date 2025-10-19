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
    return new Date(value.getTime()) as unknown as T;
  }

  // Handle Array
  if (Array.isArray(value)) {
    const copy = value.map((item) => deepCopy(item));
    return copy as unknown as T;
  }

  // Handle plain Object
  const copy: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    copy[key] = deepCopy(val as unknown);
  }

  return copy as unknown as T;
}
