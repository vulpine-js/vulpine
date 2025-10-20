import { ComponentInterface } from '../interfaces/component.interface';
import { DirectiveInterface } from '../interfaces/directive.interface';
import handleViewModel from '../utils/handle-view-model';
import { directive } from './directive';

const formDirective = (
  element: Element,
  directives: DirectiveInterface[],
  componentInstance?: ComponentInterface,
) => {
  const component = componentInstance as ComponentInterface;

  for (let i = 0; i < directives.length; i += 1) {
    const dir = directives[i];

    switch (dir.name) {
      case 'control':
        handleViewModel(element, dir.valueCaller, component);
        break;
      default:
        break;
    }
  }

  return element;
};

directive(formDirective, 'form');

export default formDirective;
