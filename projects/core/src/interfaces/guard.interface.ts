export interface GuardInterface {
  path: string;
  exact?: boolean;
  resolve?: () => Promise<any>;
  guard: (resolvedData?: any, routeParams?: Record<string, any>) => Promise<boolean> | boolean;
  isActive?: boolean;
  type?: 'active' | 'deactivate';
}
