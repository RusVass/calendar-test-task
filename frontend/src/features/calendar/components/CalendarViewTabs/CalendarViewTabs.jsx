import { Button } from '../../../../components/ui/Button/Button';
import styles from './CalendarViewTabs.module.scss';

const VIEW_OPTIONS = [
  { label: 'Month', value: 'dayGridMonth' },
  { label: 'Week', value: 'timeGridWeek' },
  { label: 'Day', value: 'timeGridDay' },
  { label: 'Agenda', value: 'listWeek' },
];

export const CalendarViewTabs = ({ activeView, onViewChange }) => {
  return (
    <div className={styles.tabs}>
      {VIEW_OPTIONS.map((viewOption) => {
        return (
          <Button
            key={viewOption.value}
            variant="tab"
            isActive={activeView === viewOption.value}
            onClick={() => {
              onViewChange(viewOption.value);
            }}
          >
            {viewOption.label}
          </Button>
        );
      })}
    </div>
  );
};
