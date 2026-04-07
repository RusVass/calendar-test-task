# Calendar Test Task

A React calendar application built with FullCalendar.  
It supports event creation, editing, deletion, drag and drop, resize, and month, week, day, and agenda views.

## Design Reference

- Adobe XD spec: https://xd.adobe.com/spec/75bd36fc-a3d9-4efa-45ab-45cbd3c74063-038c/
- Password: `ReactTest2019`
Run development server
npm run dev
Build for production
npm run build
Run lint
npm run lint
Features
Event Management
Create a new event via modal.
Edit existing events.
Delete events.
Drag and drop events to a different date or time.
Resize events to change duration.
Keep the selected event color and display it correctly.
Form Validation
Event title is required.
Maximum title length is 30 characters.
Past dates are not allowed.
endTime must be greater than startTime.
Calendar Views
Month
Week
Day
Agenda
Navigation
Today, Back, and Next buttons.
Switch views using tabs.
Dynamic header title based on the current view and date.
Date click transitions:
click a date in Month or Week view to open Day view for that date;
click a time slot in Day view to open the event modal.
Current Time Indicator
nowIndicator is enabled in time grid views.
The indicator line and marker are custom styled to match the design.
Architecture

The project is structured around the calendar feature and reusable UI components.

features/calendar contains the calendar business logic.
components/ui contains reusable UI components such as Button and Modal.
layouts and pages define the application layout and page structure.
Project Structure
src/
  App.jsx
  main.jsx
  styles/
    globals.scss
    variables.scss

  components/
    ui/
      Button/
        Button.jsx
        Button.module.scss
      Modal/
        Modal.jsx
        Modal.module.scss

  features/
    calendar/
      components/
        CalendarShell/
          CalendarShell.jsx
          CalendarShell.module.scss
        CalendarToolbar/
          CalendarToolbar.jsx
          CalendarToolbar.module.scss
        CalendarViewTabs/
          CalendarViewTabs.jsx
          CalendarViewTabs.module.scss
        EventFormModal/
          EventFormModal.jsx
          EventFormModal.module.scss
      helpers/
        eventForm.js
      store/
        useCalendarStore.js

  layouts/
    MainLayout/
      MainLayout.jsx
      MainLayout.module.scss

  pages/
    CalendarPage/
      CalendarPage.jsx
## Goal

Recreate the provided UI and implement the main calendar workflows:

- create events with validation;
- choose an event color;
- display events in the correct time order;
- handle simultaneous events correctly;
- edit and delete events;
- support drag and drop and resize;
- navigate across month, week, and day views, including date click transitions.

## Tech Stack

### Core

- React
- Vite
- FullCalendar:
  - `@fullcalendar/react`
  - `@fullcalendar/daygrid`
  - `@fullcalendar/timegrid`
  - `@fullcalendar/list`
  - `@fullcalendar/interaction`
- Zustand for state management
- SCSS Modules for styling

### Tooling

- ESLint
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`

## Getting Started

### Install

```bash
npm install
```