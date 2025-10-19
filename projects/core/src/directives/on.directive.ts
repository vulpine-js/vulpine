import { DirectiveInterface } from '../interfaces/directive.interface';
import { addEventListener } from '../utils/add-event-listener';
import { directive } from './directive';

export const onDirective = (element: Element, directives: DirectiveInterface[]) => {
  const events: Record<string, ((event: Event) => void)[]> = {};
  for (let i = 0; i < directives.length; i++) {
    const dir = directives[i];
    if (!events[dir.name]) {
      events[dir.name] = [];
    }
    events[dir.name].push(dir.valueCaller);
  }
  addEventListener(element, events);
  return element;
};

directive(onDirective, 'on');
