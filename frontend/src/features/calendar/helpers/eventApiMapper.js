const DEFAULT_EVENT_COLOR = '#3b82f6';

export const mapApiEventToCalendarEvent = (apiEvent) => {
  const color = apiEvent.color || DEFAULT_EVENT_COLOR;

  return {
    id: apiEvent.id,
    title: apiEvent.title,
    start: apiEvent.start,
    end: apiEvent.end,
    backgroundColor: color,
    borderColor: color,
  };
};

export const mapCalendarEventToApiPayload = (eventData) => {
  const color =
    eventData.color ||
    eventData.backgroundColor ||
    eventData.borderColor ||
    DEFAULT_EVENT_COLOR;

  return {
    title: eventData.title,
    start: eventData.start,
    end: eventData.end,
    color,
  };
};
