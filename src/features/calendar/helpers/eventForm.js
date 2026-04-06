const padValue = (value) => {
  return String(value).padStart(2, '0');
};

export const formatDateForInput = (dateValue) => {
  const date = new Date(dateValue);

  const year = date.getFullYear();
  const month = padValue(date.getMonth() + 1);
  const day = padValue(date.getDate());

  return `${year}-${month}-${day}`;
};

export const formatTimeForInput = (dateValue) => {
  const date = new Date(dateValue);

  const hours = padValue(date.getHours());
  const minutes = padValue(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const buildEventDateTime = (date, time) => {
  return `${date}T${time}:00`;
};

export const getDefaultEndTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);

  const nextDate = new Date();
  nextDate.setHours(hours, minutes, 0, 0);
  nextDate.setMinutes(nextDate.getMinutes() + 60);

  const nextHours = padValue(nextDate.getHours());
  const nextMinutes = padValue(nextDate.getMinutes());

  return `${nextHours}:${nextMinutes}`;
};

export const createInitialFormValues = (selectedEvent, selectedDate) => {
  if (selectedEvent) {
    return {
      title: selectedEvent.title || '',
      date: formatDateForInput(selectedEvent.start),
      startTime: formatTimeForInput(selectedEvent.start),
      endTime: formatTimeForInput(selectedEvent.end),
      color: selectedEvent.backgroundColor || '#3b82f6',
    };
  }

  const baseDate = selectedDate || new Date();
  const defaultDate = formatDateForInput(baseDate);
  const defaultStartTime = '09:00';
  const defaultEndTime = getDefaultEndTime(defaultStartTime);

  return {
    title: '',
    date: defaultDate,
    startTime: defaultStartTime,
    endTime: defaultEndTime,
    color: '#3b82f6',
  };
};

