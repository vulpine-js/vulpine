const applyEvent = (
  element: Element,
  events: Record<string, ((event: Event) => void)[]>,
  prevent: boolean,
) => {
  for (const eventType in events) {
    const handlers = events[eventType];
    if (!handlers || handlers.length === 0) continue;

    for (let i = 0; i < handlers.length; i++) {
      const handler = handlers[i];
      if (prevent) {
        element.addEventListener(
          eventType,
          (e: Event) => {
            e.preventDefault();
            handler(e);
          },
          false,
        );
      } else {
        element.addEventListener(eventType, handler, false);
      }
    }
  }
};

export const addEventListener = (
  element: Element,
  events: Record<string, ((event: Event) => void)[]>,
  preventEvents: Record<string, ((event: Event) => void)[]> = {},
) => {
  applyEvent(element, events || {}, false);
  applyEvent(element, preventEvents || {}, true);

  return element;
};
