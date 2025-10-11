"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRendering = listRendering;
function listRendering(classComponent, elementCreator, valueCaller, trackBy = null) {
    const instance = classComponent;
    const comment = document.createComment(" for ");
    const fragment = document.createDocumentFragment();
    let elementsArray = [];
    const watcher = {
        isConnected: () => comment.isConnected,
        valueCaller,
        evaluate: (newValue, oldValue = []) => {
            const hasDifferentTrackByValue = () => !!newValue.find((value, index) => {
                if (!trackBy) {
                    return false;
                }
                return oldValue[index][trackBy] !== value[trackBy];
            });
            if (oldValue.length !== newValue.length ||
                (trackBy && hasDifferentTrackByValue())) {
                return true;
            }
            else {
                return false;
            }
        },
        update: (newValue, oldValue = []) => {
            const trackByKeyToIndexMap = new Map();
            const newElementsArray = new Array(newValue.length);
            // Build a map of trackBy keys to indices for the old array
            oldValue.forEach((item, index) => {
                const key = trackBy ? item[trackBy] : index;
                trackByKeyToIndexMap.set(key, index);
            });
            // Process the new array
            newValue.forEach((newItem, newIndex) => {
                const newKey = trackBy ? newItem[trackBy] : newIndex;
                const oldIndex = trackByKeyToIndexMap.get(newKey);
                if (oldIndex !== undefined) {
                    // Reuse the existing element
                    newElementsArray[newIndex] = elementsArray[oldIndex];
                    trackByKeyToIndexMap.delete(newKey);
                }
                else {
                    // Create a new element if it doesn't exist
                    const newElement = elementCreator(newIndex);
                    newElementsArray[newIndex] = newElement;
                    // Append the new element after the comment or the last element
                    const before = newElementsArray[newIndex - 1] || comment;
                    before.after(newElement);
                }
            });
            // Remove elements that are no longer in the new array
            trackByKeyToIndexMap.forEach((_, oldIndex) => {
                elementsArray[oldIndex].remove();
            });
            // Update the elements array
            elementsArray = newElementsArray;
        },
    };
    fragment.appendChild(comment);
    instance.addWatcher(watcher, true);
    if (instance.initialChangeDetectionDone || instance.initialChangeDetectionRunning) {
        instance.runWatcher(watcher);
    }
    return fragment;
}
