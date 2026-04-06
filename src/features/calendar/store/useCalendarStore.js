import { create } from 'zustand';

const INITIAL_EVENTS = [
  {
    id: '1',
    title: 'Call with client',
    start: '2018-01-10T09:00:00',
    end: '2018-01-10T10:00:00',
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  {
    id: '2',
    title: 'Team meeting',
    start: '2018-01-15T13:00:00',
    end: '2018-01-15T14:00:00',
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  {
    id: '3',
    title: 'Design review',
    start: '2018-01-18T11:30:00',
    end: '2018-01-18T12:30:00',
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
];

export const useCalendarStore = create((set) => {
  return {
    events: INITIAL_EVENTS,
    selectedEvent: null,
    selectedDate: null,
    isEventModalOpen: false,
    activeView: 'dayGridMonth',

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

    addEvent: (event) => {
      set((state) => {
        return {
          events: [...state.events, event],
        };
      });
    },

    updateEvent: (updatedEvent) => {
      set((state) => {
        return {
          events: state.events.map((event) => {
            if (event.id !== updatedEvent.id) {
              return event;
            }

            return {
              ...event,
              ...updatedEvent,
              backgroundColor:
                updatedEvent.backgroundColor || event.backgroundColor,
              borderColor: updatedEvent.borderColor || event.borderColor,
            };
          }),
        };
      });
    },

    deleteEvent: (eventId) => {
      set((state) => {
        return {
          events: state.events.filter((event) => {
            return event.id !== eventId;
          }),
        };
      });
    },
  };
});
