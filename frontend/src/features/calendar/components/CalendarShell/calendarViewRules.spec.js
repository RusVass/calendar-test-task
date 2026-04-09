import { describe, expect, it } from 'vitest';
import { isSimpleMobileView, shouldSwitchToMobileDefaultView } from './calendarViewRules';

describe('calendarViewRules', () => {
  it('returns true for listWeek as simple mobile view', () => {
    const result = isSimpleMobileView('listWeek');

    expect(result).toBe(true);
  });

  it('returns true for timeGridDay as simple mobile view', () => {
    const result = isSimpleMobileView('timeGridDay');

    expect(result).toBe(true);
  });

  it('returns false for dayGridMonth as simple mobile view', () => {
    const result = isSimpleMobileView('dayGridMonth');

    expect(result).toBe(false);
  });

  it('returns false when viewport is still desktop', () => {
    const result = shouldSwitchToMobileDefaultView({
      wasMobileViewport: false,
      isMobileViewport: false,
      activeView: 'dayGridMonth',
    });

    expect(result).toBe(false);
  });

  it('returns false when user already is on mobile and switches tabs manually', () => {
    const result = shouldSwitchToMobileDefaultView({
      wasMobileViewport: true,
      isMobileViewport: true,
      activeView: 'dayGridMonth',
    });

    expect(result).toBe(false);
  });

  it('returns true when layout changes from desktop to mobile on complex view', () => {
    const result = shouldSwitchToMobileDefaultView({
      wasMobileViewport: false,
      isMobileViewport: true,
      activeView: 'dayGridMonth',
    });

    expect(result).toBe(true);
  });
});
