export const normalizePath = (url: string, removeQueryAndHash = false): string => {
  if (removeQueryAndHash) {
    const pathname = new URL(url, 'http://dummy.base').pathname;
    return pathname.replace(/\/+$/, '') || '/';
  }
  return url.replace(/\/+$/, '') || '/';
};
