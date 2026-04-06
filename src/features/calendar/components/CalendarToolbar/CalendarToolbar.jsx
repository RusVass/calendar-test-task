import { useState } from 'react';
import { Button } from '../../../../components/ui/Button/Button';
import { CalendarViewTabs } from '../CalendarViewTabs/CalendarViewTabs';
import styles from './CalendarToolbar.module.scss';

export const CalendarToolbar = ({
  title,
  activeView,
  onTodayClick,
  onPrevClick,
  onNextClick,
  onViewChange,
}) => {
  const [activeNavigationTab, setActiveNavigationTab] = useState('');

  const handleTodayClick = () => {
    setActiveNavigationTab('today');
    onTodayClick();
  };

  const handlePrevClick = () => {
    setActiveNavigationTab('back');
    onPrevClick();
  };

  const handleNextClick = () => {
    setActiveNavigationTab('next');
    onNextClick();
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <h2 className={styles.label}>Calendar View</h2>

        <div className={styles.navigation}>
          <Button
            isActive={activeNavigationTab === 'today'}
            onClick={handleTodayClick}
          >
            Today
          </Button>
          <Button
            isActive={activeNavigationTab === 'back'}
            onClick={handlePrevClick}
          >
            Back
          </Button>
          <Button
            isActive={activeNavigationTab === 'next'}
            onClick={handleNextClick}
          >
            Next
          </Button>
        </div>
      </div>

      <div className={styles.center}>
        <p className={styles.period}>{title}</p>
      </div>

      <div className={styles.right}>
        <CalendarViewTabs
          activeView={activeView}
          onViewChange={onViewChange}
        />
      </div>
    </div>
  );
};
