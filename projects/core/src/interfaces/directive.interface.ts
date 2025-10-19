export interface DirectiveInterface {
  namespace: string;
  name: string;
  valueCaller: () => unknown;
}
