import { normalizePath } from "./normalize-path";
export const evaluateRoute = (browserPath, routePath, exact = false) => {
    browserPath = normalizePath(browserPath);
    routePath = normalizePath(routePath);
    const browserSegments = browserPath.split('/').filter(Boolean);
    const routeSegments = routePath.split('/').filter(Boolean);
    // If lengths mismatch and there’s no wildcard, it’s not a match
    if (exact && browserSegments.length !== routeSegments.length) {
        return {
            shouldActivate: false,
            shouldDeactivate: true,
            routeParams: {},
        };
    }
    if (!exact && browserSegments.length < routeSegments.length) {
        return {
            shouldActivate: false,
            shouldDeactivate: true,
            routeParams: {},
        };
    }
    const params = {};
    let match = true;
    for (let i = 0; i < routeSegments.length; i++) {
        const routeSegment = routeSegments[i];
        const browserSegment = browserSegments[i];
        if (routeSegment.startsWith(':')) {
            // Param
            const paramName = routeSegment.slice(1);
            params[paramName] = decodeURIComponent(browserSegment);
        }
        else if (routeSegment !== browserSegment) {
            // Static mismatch
            match = false;
            break;
        }
    }
    return {
        shouldActivate: match,
        shouldDeactivate: !match,
        routeParams: match ? params : {},
    };
};
