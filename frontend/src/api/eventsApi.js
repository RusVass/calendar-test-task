import {
  mapApiEventToCalendarEvent,
  mapCalendarEventToApiPayload,
} from '../features/calendar/helpers/eventApiMapper';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const parseResponse = async (response) => {
  if (response.ok) {
    return response.json();
  }

  let errorMessage = 'Request failed';

  try {
    const errorData = await response.json();

    if (Array.isArray(errorData.message)) {
      errorMessage = errorData.message.join(', ');
    } else if (errorData.message) {
      errorMessage = errorData.message;
    }
  } catch {
    errorMessage = response.statusText || errorMessage;
  }

  throw new Error(errorMessage);
};

export const getEvents = async () => {
  const response = await fetch(`${API_URL}/events`);
  const data = await parseResponse(response);

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((event) => {
    return mapApiEventToCalendarEvent(event);
  });
};

export const createEvent = async (eventData) => {
  const payload = mapCalendarEventToApiPayload(eventData);
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);

  return mapApiEventToCalendarEvent(data);
};

export const updateEvent = async (id, eventData) => {
  const payload = mapCalendarEventToApiPayload(eventData);
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);

  return mapApiEventToCalendarEvent(data);
};

export const deleteEvent = async (id) => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
  });

  return parseResponse(response);
};
