import { ComponentInterface } from '../interfaces/component.interface';
import { DirectiveInterface } from '../interfaces/directive.interface';
import { directive } from './directive';
import { handleModel } from './view.directive';

export const formDirective = (
  element: Element,
  directives: DirectiveInterface[],
  componentInstance?: ComponentInterface,
) => {
  const component = componentInstance as ComponentInterface;

  for (let i = 0; i < directives.length; i++) {
    const dir = directives[i];

    switch (dir.name) {
      case 'control':
        handleModel(element, dir.valueCaller, component);
        break;
    }
  }

  return element;
};

directive(formDirective, 'form');
