# Calendar Test Task

A React-based calendar application built with FullCalendar.  
Supports creating, editing, deleting, and managing events with drag-and-drop functionality.

## Goal

Implement a calendar UI based on the provided design and cover the main event workflows:

- create events with validation;
- select event color;
- display events across different calendar views;
- edit and delete events;
- support drag and drop and resize;
- navigate between dates and switch views.

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

## Features

### Event Management

- Create a new event via modal.
- Edit existing events.
- Delete events.
- Drag and drop events to a different date or time.
- Resize events to change duration.
- Persist event color and display it correctly.

### Form Validation

- Event title is required.
- Maximum title length is 30 characters.
- Past dates are not allowed.
- `endTime` must be greater than `startTime`.

### Calendar Views

- Month
- Week
- Day
- Agenda

### Navigation

- `Today`, `Back`, `Next` buttons.
- Switch between views using tabs.
- Dynamic header title based on current view and date.

## Architecture

The project is structured around the calendar feature and reusable UI components.

- `features/calendar` contains business logic.
- `components/ui` contains reusable UI components like Button and Modal.
- `layouts` and `pages` define the application structure.

## Project Structure

```text
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