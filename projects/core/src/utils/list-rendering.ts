import { ComponentInterface } from '../interfaces/component.interface';
import { WatcherInterface } from '../interfaces/watcher.interface';

export function listRendering<T = unknown>(
  classComponent: ComponentInterface,
  elementCreator: (index: number) => Element,
  valueCaller: () => T[],
  trackBy: string | null = null,
) {
  const instance: ComponentInterface = classComponent;
  const comment = document.createComment(' for ');
  const fragment = document.createDocumentFragment();
  let elementsArray: Element[] = [];
  const getKey = (item: T, fallbackIndex: number) =>
    trackBy
      ? ((item as unknown as Record<string, unknown>)[trackBy as string] as string | number)
      : fallbackIndex;

  const watcher: WatcherInterface<T[]> = {
    isConnected: () => comment.isConnected,
    valueCaller,
    evaluate: (newValue: T[], oldValue: T[] = []) => {
      const hasDifferentTrackByValue = () =>
        !!newValue.find((value, index) => {
          if (!trackBy) {
            return false;
          }
          if (!oldValue[index]) return true;
          return getKey(oldValue[index], index) !== getKey(value, index);
        });
      if (oldValue.length !== newValue.length || (trackBy && hasDifferentTrackByValue())) {
        return true;
      } else {
        return false;
      }
    },
    update: (newValue: T[], oldValue: T[] = []) => {
      const trackByKeyToIndexMap = new Map<string | number, number>();
      const newElementsArray: Element[] = new Array(newValue.length).fill(null) as Element[];

      // Build a map of trackBy keys to indices for the old array
      oldValue.forEach((item: T, index: number) => {
        const key = getKey(item, index);
        trackByKeyToIndexMap.set(key as string | number, index);
      });

      // Process the new array
      newValue.forEach((newItem: T, newIndex: number) => {
        const newKey = getKey(newItem, newIndex);
        const oldIndex = trackByKeyToIndexMap.get(newKey as string | number);

        if (oldIndex !== undefined) {
          // Reuse the existing element
          newElementsArray[newIndex] = elementsArray[oldIndex];
          trackByKeyToIndexMap.delete(newKey as string | number);
        } else {
          // Create a new element if it doesn't exist
          const newElement = elementCreator(newIndex);
          newElementsArray[newIndex] = newElement;

          // Append the new element after the comment or the last element
          const before = newElementsArray[newIndex - 1] || comment;
          (before as ChildNode).after(newElement);
        }
      });

      // Remove elements that are no longer in the new array
      trackByKeyToIndexMap.forEach((index: number) => {
        const el = elementsArray[index];
        if (el) el.remove();
      });

      // Update the elements array
      elementsArray = newElementsArray as Element[];
    },
  };

  fragment.appendChild(comment);

  instance.addWatcher(watcher, true);

  if (instance.initialChangeDetectionDone || instance.initialChangeDetectionRunning) {
    instance.runWatcher(watcher as unknown as WatcherInterface<unknown>);
  }

  return fragment;
}
