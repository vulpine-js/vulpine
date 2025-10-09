export const normalizePath = (url, removeQueryAndHash = false) => {
    if (removeQueryAndHash) {
        const pathname = new URL(url, 'http://dummy.base').pathname;
        return pathname.replace(/\/+$/, '') || '/';
    }
    return url.replace(/\/+$/, '') || '/';
};
