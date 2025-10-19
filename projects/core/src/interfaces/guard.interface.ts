export interface GuardInterface<T = unknown> {
  path: string;
  exact?: boolean;
  resolve?: () => Promise<T>;
  guard: (resolvedData?: T, routeParams?: Record<string, string>) => Promise<boolean> | boolean;
  isActive?: boolean;
  type?: 'active' | 'deactivate';
}
