import { create } from 'zustand';
import {
  createEvent as createEventRequest,
  deleteEvent as deleteEventRequest,
  getEvents,
  updateEvent as updateEventRequest,
} from '../../../api/eventsApi';

export const useCalendarStore = create((set) => {
  return {
    events: [],
    selectedEvent: null,
    selectedDate: null,
    isEventModalOpen: false,
    activeView: 'dayGridMonth',
    errorMessage: '',
    isEventsLoading: false,

    clearErrorMessage: () => {
      set({ errorMessage: '' });
    },

    fetchEvents: async () => {
      set({
        isEventsLoading: true,
        errorMessage: '',
      });

      try {
        const events = await getEvents();
        set({
          events,
          isEventsLoading: false,
        });
      } catch (error) {
        set({
          isEventsLoading: false,
          errorMessage: error.message || 'Failed to load events',
        });
        throw error;
      }
    },

    setActiveView: (view) => {
      set({ activeView: view });
    },

    setSelectedEvent: (event) => {
      set({ selectedEvent: event });
    },

    openEventModal: ({ event = null, date = null } = {}) => {
      set({
        isEventModalOpen: true,
        selectedEvent: event,
        selectedDate: date,
      });
    },

    closeEventModal: () => {
      set({
        isEventModalOpen: false,
        selectedEvent: null,
        selectedDate: null,
      });
    },

    addEvent: async (event) => {
      set({ errorMessage: '' });

      try {
        const createdEvent = await createEventRequest(event);
        set((state) => {
          return {
            events: [...state.events, createdEvent],
          };
        });
      } catch (error) {
        set({ errorMessage: error.message || 'Failed to create event' });
        throw error;
      }
    },

    updateEvent: async (updatedEvent) => {
      set({ errorMessage: '' });

      try {
        const savedEvent = await updateEventRequest(updatedEvent.id, updatedEvent);
        set((state) => {
          return {
            events: state.events.map((event) => {
              if (event.id !== savedEvent.id) {
                return event;
              }

              return {
                ...event,
                ...savedEvent,
                backgroundColor: savedEvent.backgroundColor || event.backgroundColor,
                borderColor: savedEvent.borderColor || event.borderColor,
              };
            }),
          };
        });
      } catch (error) {
        set({ errorMessage: error.message || 'Failed to update event' });
        throw error;
      }
    },

    deleteEvent: async (eventId) => {
      set({ errorMessage: '' });

      try {
        await deleteEventRequest(eventId);
        set((state) => {
          return {
            events: state.events.filter((event) => {
              return event.id !== eventId;
            }),
          };
        });
      } catch (error) {
        set({ errorMessage: error.message || 'Failed to delete event' });
        throw error;
      }
    },
  };
});
