export const isSimpleMobileView = (view) => {
  if (view === 'listWeek') {
    return true;
  }

  if (view === 'timeGridDay') {
    return true;
  }

  return false;
};

export const shouldSwitchToMobileDefaultView = ({
  wasMobileViewport,
  isMobileViewport,
  activeView,
}) => {
  if (!isMobileViewport) {
    return false;
  }

  if (wasMobileViewport) {
    return false;
  }

  if (isSimpleMobileView(activeView)) {
    return false;
  }

  return true;
};
