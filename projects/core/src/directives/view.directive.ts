import { ComponentInterface } from '../interfaces/component.interface';
import { DirectiveInterface } from '../interfaces/directive.interface';
import handleViewModel from '../utils/handle-view-model';
import { directive } from './directive';

const handleRef = (element: Element, dir: DirectiveInterface) => {
  const inputDir = dir;
  inputDir.valueCaller().value = element;
};

const viewDirective = (
  element: Element,
  directives: DirectiveInterface[],
  componentInstance?: ComponentInterface,
) => {
  const component = componentInstance as ComponentInterface;

  for (let i = 0; i < directives.length; i += 1) {
    const dir = directives[i];
    switch (dir.name) {
      case 'model':
        handleViewModel(element, dir.valueCaller, component);
        break;
      case 'ref':
        handleRef(element, dir);
        break;
      default:
        throw new Error(`Directive ${dir.namespace}:${dir.name} is not defined`);
    }
  }

  return element;
};

directive(viewDirective, 'v');

export default viewDirective;
