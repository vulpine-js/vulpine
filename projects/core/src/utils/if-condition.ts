import { ComponentInterface } from '../interfaces/component.interface';
import { WatcherInterface } from '../interfaces/watcher.interface';

const ifCondition = (
  componentInstance: any,
  elementCaller: () => Element,
  valueCaller: () => any,
) => {
  const component: ComponentInterface = componentInstance;
  const fragment = document.createDocumentFragment();
  const comment = document.createComment(' IF ');
  let element: Element | null = null;
  fragment.appendChild(comment);
  const watcher: WatcherInterface = {
    isConnected: () => comment.isConnected,
    valueCaller: () => Boolean(valueCaller()),
    evaluate: (newValue, oldValue) => newValue !== oldValue,
    update(newValue, oldValue) {
      if (newValue && !oldValue) {
        element = elementCaller();
        comment.after(element);
      } else if (!newValue && oldValue) {
        if (element) {
          element.remove();
          element = null;
        }
      }
    },
  };

  component.addWatcher(watcher, true);

  if (component.initialChangeDetectionDone || component.initialChangeDetectionRunning) {
    component.runWatcher(watcher);
  }

  return fragment;
};

export default ifCondition;
