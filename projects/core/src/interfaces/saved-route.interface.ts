export interface SavedRouteInterface {
  pathCaller: () => string;
  elementCaller: () => Element;
  exact: () => boolean;
  isActivated: boolean;
  commentElement: Comment;
  element: Element | null;
}
