export interface SavedRouteInterface {
  pathCaller: () => string;
  elementCaller: () => Element;
  isActivated: boolean;
  commentElement: Comment;
  element: Element | null;
}
