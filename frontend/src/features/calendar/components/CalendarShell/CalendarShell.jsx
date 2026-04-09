import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useCalendarStore } from '../../store/useCalendarStore';
import { EventFormModal } from '../EventFormModal/EventFormModal';
import { CalendarToolbar } from '../CalendarToolbar/CalendarToolbar';
import styles from './CalendarShell.module.scss';

const INITIAL_VIEW = 'dayGridMonth';
const MOBILE_INITIAL_VIEW = 'listWeek';
const MOBILE_MAX_WIDTH_QUERY = '(max-width: 767px)';

const formatTimeGridSlotLabel = (slotInfo) => {
  const formattedTime = slotInfo.date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return formattedTime;
};

const shouldHideEventTime = (view) => {
  if (view === 'dayGridMonth') {
    return true;
  }

  return false;
};

const isSimpleMobileView = (view) => {
  if (view === 'listWeek') {
    return true;
  }

  if (view === 'timeGridDay') {
    return true;
  }

  return false;
};

const getIsMobileViewport = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia(MOBILE_MAX_WIDTH_QUERY).matches;
};

export const CalendarShell = () => {
  const calendarRef = useRef(null);

  const events = useCalendarStore((state) => state.events);
  const isEventsLoading = useCalendarStore((state) => state.isEventsLoading);
  const errorMessage = useCalendarStore((state) => state.errorMessage);
  const activeView = useCalendarStore((state) => state.activeView);
  const setActiveView = useCalendarStore((state) => state.setActiveView);
  const openEventModal = useCalendarStore((state) => state.openEventModal);
  const updateEvent = useCalendarStore((state) => state.updateEvent);
  const fetchEvents = useCalendarStore((state) => state.fetchEvents);
  const clearErrorMessage = useCalendarStore((state) => state.clearErrorMessage);

  const [calendarTitle, setCalendarTitle] = useState('');
  const [activeNavigationTab, setActiveNavigationTab] = useState('today');
  const [isMobileViewport, setIsMobileViewport] = useState(getIsMobileViewport);

  const updateCalendarState = () => {
    const calendarApi = calendarRef.current?.getApi();

    if (!calendarApi) {
      return;
    }

    const nextView = calendarApi.view.type;

    setActiveView(nextView);
    setCalendarTitle(calendarApi.view.title);
  };

  const handleTodayClick = () => {
    const calendarApi = calendarRef.current?.getApi();

    if (!calendarApi) {
      return;
    }

    setActiveNavigationTab('today');
    calendarApi.today();
    updateCalendarState();
  };

  const handlePrevClick = () => {
    const calendarApi = calendarRef.current?.getApi();

    if (!calendarApi) {
      return;
    }

    setActiveNavigationTab('back');
    calendarApi.prev();
    updateCalendarState();
  };

  const handleNextClick = () => {
    const calendarApi = calendarRef.current?.getApi();

    if (!calendarApi) {
      return;
    }

    setActiveNavigationTab('next');
    calendarApi.next();
    updateCalendarState();
  };

  const handleViewChange = (nextView) => {
    const calendarApi = calendarRef.current?.getApi();

    if (!calendarApi) {
      return;
    }

    setActiveNavigationTab('');
    calendarApi.changeView(nextView);
    updateCalendarState();
  };

  const handleDatesSet = (info) => {
    setActiveView(info.view.type);
    setCalendarTitle(info.view.title);
  };

  const handleDateClick = (info) => {
    const calendarApi = calendarRef.current?.getApi();

    if (!calendarApi) {
      return;
    }

    if (activeView !== 'timeGridDay') {
      setActiveNavigationTab('');
      calendarApi.changeView('timeGridDay', info.date);
      updateCalendarState();
      return;
    }

    openEventModal({ date: info.dateStr });
  };

  const handleEventClick = (info) => {
    openEventModal({ event: info.event.toPlainObject() });
  };

  const handleEventDrop = async (info) => {
    const nextEvent = {
      id: info.event.id,
      start: info.event.start?.toISOString(),
      end: info.event.end?.toISOString(),
    };

    try {
      await updateEvent(nextEvent);
    } catch {
      info.revert();
    }
  };

  const handleEventResize = async (info) => {
    const nextEvent = {
      id: info.event.id,
      start: info.event.start?.toISOString(),
      end: info.event.end?.toISOString(),
    };

    try {
      await updateEvent(nextEvent);
    } catch {
      info.revert();
    }
  };

  const handleErrorDismiss = () => {
    clearErrorMessage();
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MAX_WIDTH_QUERY);

    const updateViewportState = (event) => {
      setIsMobileViewport(event.matches);
    };

    setIsMobileViewport(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateViewportState);

    return () => {
      mediaQuery.removeEventListener('change', updateViewportState);
    };
  }, []);

  useEffect(() => {
    if (!isMobileViewport) {
      return;
    }

    if (isSimpleMobileView(activeView)) {
      return;
    }

    setActiveView(MOBILE_INITIAL_VIEW);
  }, [activeView, isMobileViewport, setActiveView]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        await fetchEvents();
      } catch {
        return;
      }
    };

    loadEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();

    if (!calendarApi) {
      return;
    }

    if (calendarApi.view.type === activeView) {
      return;
    }

    calendarApi.changeView(activeView);
    updateCalendarState();
  }, [activeView]);

  return (
    <section className={styles.card}>
      <CalendarToolbar
        title={calendarTitle}
        activeView={activeView}
        activeNavigationTab={activeNavigationTab}
        onTodayClick={handleTodayClick}
        onPrevClick={handlePrevClick}
        onNextClick={handleNextClick}
        onViewChange={handleViewChange}
      />

      <div className={styles.calendarWrapper}>
        {isEventsLoading ? (
          <div className={styles.loadingBanner}>Loading events...</div>
        ) : null}

        {errorMessage ? (
          <div className={styles.errorBanner}>
            <span>{errorMessage}</span>
            <button
              type="button"
              className={styles.errorDismiss}
              onClick={handleErrorDismiss}
            >
              Dismiss
            </button>
          </div>
        ) : null}

        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          initialView={isMobileViewport ? MOBILE_INITIAL_VIEW : INITIAL_VIEW}
          headerToolbar={false}
          height="auto"
          editable={true}
          selectable={false}
          allDaySlot={true}
          navLinks={true}
          navLinkDayClick="timeGridDay"
          slotEventOverlap={activeView !== 'timeGridDay'}
          slotLabelInterval="02:00:00"
          slotLabelContent={formatTimeGridSlotLabel}
          nowIndicator={true}
          datesSet={handleDatesSet}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          displayEventTime={!shouldHideEventTime(activeView)}
          dayMaxEvents={false}
          fixedWeekCount={false}
          showNonCurrentDates={true}
          weekends={true}
          events={events}
        />
      </div>

      <EventFormModal />
    </section>
  );
};
