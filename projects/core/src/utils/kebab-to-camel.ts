export const kebabToCamel = (str: string) => {
  const camel = str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
  return camel.charAt(0).toLowerCase() + camel.slice(1);
};
