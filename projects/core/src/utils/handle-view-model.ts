import { ComponentInterface } from '../interfaces/component.interface';
import { DirectiveInterface } from '../interfaces/directive.interface';
import { StateInterface } from '../interfaces/state.interface';

const handleViewModel = (
  element: Element,
  valueCaller: DirectiveInterface['valueCaller'],
  component: ComponentInterface,
) => {
  const model: StateInterface = valueCaller();
  component.addWatcher({
    isConnected: () => element.isConnected,
    evaluate: (newValue, oldValue) => newValue !== oldValue,
    update: (newValue) => {
      switch (element.localName) {
        case 'textarea':
        case 'input': {
          const input = element as HTMLInputElement;
          input.value = newValue;
          break;
        }
        default:
          break;
      }
    },
    valueCaller: () => model.value,
  });

  switch (element.localName) {
    case 'textarea':
    case 'input':
      element.addEventListener('input', (event) => {
        model.value = (event.target as HTMLInputElement).value;
      });
      break;
    default:
      break;
  }
};

export default handleViewModel;
