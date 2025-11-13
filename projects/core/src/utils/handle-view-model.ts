import { ComponentInterface } from '../interfaces/component.interface';
import { DirectiveInterface } from '../interfaces/directive.interface';
import { StateInterface } from '../interfaces/state.interface';
import { vulpineValidationΘ } from './vulpine-validation';

const handleViewModel = (
  elementInput: Element,
  valueCaller: DirectiveInterface['valueCaller'],
  component: ComponentInterface,
) => {
  const model: StateInterface = valueCaller();
  const element = elementInput;

  vulpineValidationΘ(() => {
    if (element.localName === 'input' && (element as HTMLInputElement).type === 'file') {
      throw new Error('Model cannot be used in an input with type file.');
    }
  });

  // --- Watch model and update the DOM when model changes ---
  component.addWatcher({
    isConnected: () => element.isConnected,
    evaluate: (newValue, oldValue) => newValue !== oldValue,
    update: (newValue) => {
      switch (element.localName) {
        case 'input': {
          const input = element as HTMLInputElement;
          switch (input.type) {
            case 'checkbox':
              input.checked = !!newValue;
              break;
            case 'radio':
              input.checked = input.value === String(newValue);
              break;
            default:
              input.value = newValue ?? '';
              break;
          }
          break;
        }

        case 'textarea': {
          const textarea = element as HTMLTextAreaElement;
          textarea.value = newValue ?? '';
          break;
        }

        case 'select': {
          const select = element as HTMLSelectElement;
          if (select.multiple && Array.isArray(newValue)) {
            Array.from(select.options).forEach((optItem) => {
              const opt = optItem;
              opt.selected = newValue.includes(opt.value);
            });
          } else {
            select.value = newValue ?? '';
          }
          break;
        }

        default:
          // Optional: handle contenteditable
          if (element instanceof HTMLElement && element.isContentEditable) {
            element.textContent = newValue ?? '';
          }
          break;
      }
    },
    valueCaller: () => model.value,
  });

  // --- Watch element events and update the model ---
  const updateModelFromElement = (event: Event) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

    let newValue: any = target.value;

    if (target instanceof HTMLInputElement) {
      switch (target.type) {
        case 'checkbox':
          newValue = target.checked;
          break;
        case 'radio':
          if (target.checked) newValue = target.value;
          else return;
          break;
        case 'number':
        case 'range':
          newValue = Number(target.value);
          break;
        default:
          newValue = target.value;
          break;
      }
    } else if (target instanceof HTMLSelectElement) {
      if (target.multiple) {
        newValue = Array.from(target.selectedOptions).map((o) => o.value);
      } else {
        newValue = target.value;
      }
    } else if (target instanceof HTMLTextAreaElement) {
      newValue = target.value;
    }

    model.value = newValue;
  };

  switch (element.localName) {
    case 'input':
    case 'textarea':
    case 'select':
      element.addEventListener('input', updateModelFromElement);
      element.addEventListener('change', updateModelFromElement);
      break;

    default:
      if (element instanceof HTMLElement && element.isContentEditable) {
        element.addEventListener('input', updateModelFromElement);
      }
      break;
  }
};

export default handleViewModel;
