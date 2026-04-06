import { CalendarShell } from '../../features/calendar/components/CalendarShell/CalendarShell';
import styles from './MainLayout.module.scss';

const SIDEBAR_ITEMS = [
  'Home',
  'Dashboard',
  'Inbox',
  'Products',
  'Invoices',
  'Customers',
  'Chat Room',
  'Calendar',
  'Help Center',
  'Settings',
];

export const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>IMPEKABLE</div>

        <nav className={styles.navigation}>
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = item === 'Calendar';

            const classNames = [styles.navItem];
            if (isActive) {
              classNames.push(styles.navItemActive);
            }

            return (
              <button
                key={item}
                type="button"
                className={classNames.join(' ')}
              >
                {item}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.search}>
            Search transactions, invoices or help
          </div>

          <div className={styles.headerRight}>
            <span className={styles.userName}>John Doe</span>
            <div className={styles.avatar}>JD</div>
          </div>
        </header>

        <main className={styles.content}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Calendar</h1>
          </div>

          <CalendarShell />
        </main>
      </div>
    </div>
  );
};
