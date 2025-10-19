import { ComponentInterface } from '../interfaces/component.interface';
import { DirectiveInterface } from '../interfaces/directive.interface';
import { kebabToCamel } from '../utils/kebab-to-camel';
import { directive } from './directive';

export const styleDirective = (
  element: Element,
  directives: DirectiveInterface[],
  componentInstance?: ComponentInterface,
) => {
  const component = componentInstance as ComponentInterface;

  for (let i = 0; i < directives.length; i++) {
    const dir = directives[i];
    component.addWatcher({
      isConnected: () => element.isConnected,
      valueCaller: dir.valueCaller,
      evaluate: (newValue, oldValue) => newValue !== oldValue,
      update: (newValue: unknown) => {
        // Prefer setProperty with kebab-case name to avoid indexing CSSStyleDeclaration
        const propName = dir.name;
        const el = element as HTMLElement;
        try {
          el.style.setProperty(propName, newValue == null ? '' : String(newValue));
        } catch (e) {
          // Fallback: assign directly to style object (best-effort)
          const styleObj = el.style as unknown as Record<string, string | undefined>;
          styleObj[kebabToCamel(propName)] = newValue == null ? '' : String(newValue);
        }
      },
    });
  }

  return element;
};

directive(styleDirective, 'style');
