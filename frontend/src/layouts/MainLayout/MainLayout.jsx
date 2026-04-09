import { useEffect, useState } from 'react';
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

const HeaderGlobeIcon = () => {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm4.95 6h-2.1a9.7 9.7 0 0 0-.7-3.15A5.02 5.02 0 0 1 12.95 7.5Zm-4.2 0v-4.3c.78.2 1.52 1.74 1.8 4.3h-1.8Zm-1.5 0h-1.8c.28-2.56 1.02-4.1 1.8-4.3v4.3Zm0 1.2V13c-.78-.2-1.52-1.74-1.8-4.3h1.8Zm1.5 4.3V8.7h1.8c-.28 2.56-1.02 4.1-1.8 4.3Zm0-5.5c-.07-1.03-.2-1.98-.4-2.78-.19-.77-.44-1.43-.75-1.96A5.02 5.02 0 0 1 10.15 3.35c.35.94.58 2.09.7 3.35h-2.1Zm-2.9-3.15A9.7 9.7 0 0 0 5.15 7.5h-2.1a5.02 5.02 0 0 1 2.8-3.15Zm-2.8 4.35h2.1c.12 1.26.35 2.41.7 3.35a5.02 5.02 0 0 1-2.8-3.35Zm7.1 3.35c.35-.94.58-2.09.7-3.35h2.1a5.02 5.02 0 0 1-2.8 3.35Z"
        fill="currentColor"
      />
    </svg>
  );
};

const HeaderChatIcon = () => {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 2c3.04 0 5.5 1.94 5.5 4.33S11.04 10.67 8 10.67c-.63 0-1.23-.08-1.8-.24l-2.84 1.42.9-2.13C3.16 8.9 2.5 7.67 2.5 6.33 2.5 3.94 4.96 2 8 2Zm0 1.2c-2.36 0-4.3 1.44-4.3 3.13 0 1.05.73 2.03 1.96 2.6l.42.2-.38.9 1.2-.6.25.07c.5.14 1.04.22 1.6.22 2.36 0 4.3-1.44 4.3-3.13C12.3 4.64 10.36 3.2 8 3.2Z"
        fill="currentColor"
      />
    </svg>
  );
};

const HeaderBellIcon = () => {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 2.2a3.1 3.1 0 0 0-3.1 3.1v1.15c0 .73-.2 1.45-.58 2.08L3.6 9.8a.8.8 0 0 0 .69 1.2h7.42a.8.8 0 0 0 .69-1.2l-.72-1.26a4.06 4.06 0 0 1-.58-2.08V5.3A3.1 3.1 0 0 0 8 2.2Zm-1.9 3.1a1.9 1.9 0 1 1 3.8 0v1.15c0 .95.25 1.89.74 2.7l.18.3H5.18l.18-.3c.49-.81.74-1.75.74-2.7V5.3ZM6.3 12.05a1.7 1.7 0 0 0 3.4 0h-1.2a.5.5 0 1 1-1 0H6.3Z"
        fill="currentColor"
      />
    </svg>
  );
};

const HeaderMenuIcon = () => {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2 4.2a.6.6 0 0 1 .6-.6h10.8a.6.6 0 1 1 0 1.2H2.6a.6.6 0 0 1-.6-.6Zm0 3.8a.6.6 0 0 1 .6-.6h10.8a.6.6 0 1 1 0 1.2H2.6A.6.6 0 0 1 2 8Zm0 3.8a.6.6 0 0 1 .6-.6h10.8a.6.6 0 0 1 0 1.2H2.6a.6.6 0 0 1-.6-.6Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsSidebarOpen((currentState) => {
      return !currentState;
    });
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleSidebarItemClick = () => {
    if (window.innerWidth < 768) {
      handleSidebarClose();
    }
  };

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth >= 768) {
        handleSidebarClose();
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      return;
    }

    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const sidebarClassNames = [styles.sidebar];
  if (isSidebarOpen) {
    sidebarClassNames.push(styles.sidebarOpen);
  }

  return (
    <div className={styles.layout}>
      <aside className={sidebarClassNames.join(' ')}>
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
                onClick={handleSidebarItemClick}
              >
                {item}
              </button>
            );
          })}
        </nav>
      </aside>

      <button
        type="button"
        className={styles.sidebarOverlay}
        aria-label="Close sidebar"
        onClick={handleSidebarClose}
        data-open={isSidebarOpen ? 'true' : 'false'}
      />

      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              type="button"
              className={styles.menuButton}
              aria-label="Open menu"
              aria-expanded={isSidebarOpen}
              onClick={handleMenuToggle}
            >
              <HeaderMenuIcon />
            </button>

            <div className={styles.search}>
              <span className={styles.searchLongText}>
                Search transactions, invoices or help
              </span>
              <span className={styles.searchShortText}>Search</span>
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.headerIcons}>
              <button type="button" className={styles.iconButton} aria-label="Global">
                <HeaderGlobeIcon />
              </button>

              <button type="button" className={styles.iconButton} aria-label="Messages">
                <HeaderChatIcon />
              </button>

              <button type="button" className={styles.iconButton} aria-label="Notifications">
                <HeaderBellIcon />
              </button>
            </div>

            <div className={styles.userDivider} />
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
