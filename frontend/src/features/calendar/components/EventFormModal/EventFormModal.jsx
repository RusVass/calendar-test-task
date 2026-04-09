import { useEffect, useState } from 'react';
import { Button } from '../../../../components/ui/Button/Button';
import { Modal } from '../../../../components/ui/Modal/Modal';
import { useCalendarStore } from '../../store/useCalendarStore';
import {
  buildEventDateTime,
  createInitialFormValues,
} from '../../helpers/eventForm';
import styles from './EventFormModal.module.scss';

const COLOR_OPTIONS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const MAX_TITLE_LENGTH = 30;

const isPastDate = (date) => {
  const today = new Date();
  const selected = new Date(date);

  today.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);

  if (Number.isNaN(selected.getTime())) {
    return false;
  }

  return selected < today;
};

export const EventFormModal = () => {
  const isOpen = useCalendarStore((state) => state.isEventModalOpen);
  const selectedEvent = useCalendarStore((state) => state.selectedEvent);
  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const closeEventModal = useCalendarStore((state) => state.closeEventModal);
  const addEvent = useCalendarStore((state) => state.addEvent);
  const updateEvent = useCalendarStore((state) => state.updateEvent);
  const deleteEvent = useCalendarStore((state) => state.deleteEvent);

  const [formValues, setFormValues] = useState(() => {
    return createInitialFormValues(selectedEvent, selectedDate);
  });

  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState('');
  const [isSavePending, setIsSavePending] = useState(false);
  const [isDeletePending, setIsDeletePending] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormValues(createInitialFormValues(selectedEvent, selectedDate));
    setErrors({});
    setRequestError('');
    setIsSavePending(false);
    setIsDeletePending(false);
  }, [isOpen, selectedEvent, selectedDate]);

  const validate = (values) => {
    const nextErrors = {};

    if (!values.title.trim()) {
      nextErrors.title = 'Event name is required';
    }

    if (values.title.length > MAX_TITLE_LENGTH) {
      nextErrors.title = 'Max 30 characters';
    }

    if (values.date && isPastDate(values.date)) {
      nextErrors.date = 'Past date not allowed';
    }

    const start = buildEventDateTime(values.date, values.startTime);
    const end = buildEventDateTime(values.date, values.endTime);

    if (new Date(start) >= new Date(end)) {
      nextErrors.time = 'End time must be after start time';
    }

    return nextErrors;
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setFormValues((currentValues) => {
      const nextValues = {
        ...currentValues,
        [name]: value,
      };

      const nextErrors = validate(nextValues);
      setErrors(nextErrors);

      return nextValues;
    });
  };

  const handleColorSelect = (color) => {
    setFormValues((currentValues) => {
      return {
        ...currentValues,
        color,
      };
    });
  };

  const handleSave = async () => {
    const validationErrors = validate(formValues);
    setErrors(validationErrors);
    setRequestError('');

    if (isSavePending) {
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const nextEvent = {
      title: formValues.title.trim(),
      start: buildEventDateTime(formValues.date, formValues.startTime),
      end: buildEventDateTime(formValues.date, formValues.endTime),
      backgroundColor: formValues.color,
      borderColor: formValues.color,
    };

    try {
      setIsSavePending(true);

      if (selectedEvent) {
        await updateEvent({
          ...nextEvent,
          id: selectedEvent.id,
        });
      } else {
        await addEvent(nextEvent);
      }
      closeEventModal();
    } catch (error) {
      setRequestError(error.message || 'Failed to save event');
    } finally {
      setIsSavePending(false);
    }
  };

  const handleDiscard = async () => {
    setRequestError('');

    if (isDeletePending) {
      return;
    }

    if (selectedEvent?.id) {
      try {
        setIsDeletePending(true);
        await deleteEvent(selectedEvent.id);
      } catch (error) {
        setRequestError(error.message || 'Failed to delete event');
        setIsDeletePending(false);
        return;
      }

      setIsDeletePending(false);
    }

    closeEventModal();
  };

  const modalTitle = selectedEvent ? 'Edit Event' : 'Add Event';

  const hasErrors = Object.keys(errors).length > 0;
  const isSaveDisabled = hasErrors || isSavePending || isDeletePending;

  return (
    <Modal
      isOpen={isOpen}
      title={modalTitle}
      onClose={closeEventModal}
    >
      <div className={styles.form}>
        <label className={styles.field}>
          <span className={styles.label}>Event</span>

          <input
            className={styles.input}
            type="text"
            name="title"
            value={formValues.title}
            onChange={handleFieldChange}
          />

          {errors.title && (
            <span className={styles.error}>{errors.title}</span>
          )}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Date</span>

          <input
            className={styles.input}
            type="date"
            name="date"
            value={formValues.date}
            onChange={handleFieldChange}
          />

          {errors.date && (
            <span className={styles.error}>{errors.date}</span>
          )}
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>Start</span>

            <input
              className={styles.input}
              type="time"
              name="startTime"
              value={formValues.startTime}
              onChange={handleFieldChange}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>End</span>

            <input
              className={styles.input}
              type="time"
              name="endTime"
              value={formValues.endTime}
              onChange={handleFieldChange}
            />
          </label>
        </div>

        {errors.time && (
          <span className={styles.error}>{errors.time}</span>
        )}

        {requestError && (
          <span className={styles.error}>{requestError}</span>
        )}

        <div className={styles.field}>
          <span className={styles.label}>Color</span>

          <div className={styles.colors}>
            {COLOR_OPTIONS.map((color) => {
              const isActive = formValues.color === color;

              return (
                <button
                  key={color}
                  type="button"
                  className={`${styles.colorButton} ${isActive ? styles.colorButtonActive : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    handleColorSelect(color);
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className={styles.actions}>
          <Button onClick={handleDiscard} disabled={isSavePending || isDeletePending}>
            {isDeletePending ? 'Deleting...' : 'Discard'}
          </Button>

          <Button
            variant="tab"
            onClick={handleSave}
            disabled={isSaveDisabled}
          >
            {isSavePending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

