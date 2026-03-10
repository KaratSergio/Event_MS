import type { Event as RBCEvent } from 'react-big-calendar';
import type { Event } from '../../services';

export interface CalendarEvent extends RBCEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Event & {
    isOrganizer: boolean;
  };
}

export interface DayCardProps {
  day: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isSelected: boolean;
  onDayClick: (day: Date) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}