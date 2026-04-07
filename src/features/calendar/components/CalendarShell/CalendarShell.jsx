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

export const CalendarShell = () => {
  const calendarRef = useRef(null);

  const events = useCalendarStore((state) => state.events);
  const activeView = useCalendarStore((state) => state.activeView);
  const setActiveView = useCalendarStore((state) => state.setActiveView);
  const openEventModal = useCalendarStore((state) => state.openEventModal);
  const updateEvent = useCalendarStore((state) => state.updateEvent);

  const [calendarTitle, setCalendarTitle] = useState('');
  const [activeNavigationTab, setActiveNavigationTab] = useState('today');

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

  const handleEventDrop = (info) => {
    updateEvent({
      id: info.event.id,
      start: info.event.start?.toISOString(),
      end: info.event.end?.toISOString(),
    });
  };

  const handleEventResize = (info) => {
    updateEvent({
      id: info.event.id,
      start: info.event.start?.toISOString(),
      end: info.event.end?.toISOString(),
    });
  };

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
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          initialView={INITIAL_VIEW}
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
