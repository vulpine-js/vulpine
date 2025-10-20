import { WatcherInterface } from '../interfaces/watcher.interface';

const runWatcher = (watcherInput: WatcherInterface) => {
  const watcher = watcherInput;
  const oldValue = watcher.value;
  const newValue = watcher.valueCaller();
  if (watcher.evaluate(newValue, oldValue)) {
    watcher.update(newValue, oldValue);
    watcher.value = newValue;
  }
};

export default runWatcher;
