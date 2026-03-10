import { format } from 'date-fns/format';
import { startOfWeek } from 'date-fns/startOfWeek';
import type { CalendarEvent, DayCardProps } from './types';
import { EventItem } from './EventItem';

interface DayViewWithWeekProps {
  date: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onDayClick: (day: Date) => void;
  selectedDate: Date;
}

const MobileDayCard: React.FC<DayCardProps> = ({ day, events, isToday, isSelected, onDayClick, onSelectEvent }) => {
  return (
    <div
      onClick={() => onDayClick(day)}
      className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${isSelected
        ? 'border-blue-500 ring-2 ring-blue-200'
        : isToday
          ? 'border-green-500'
          : 'border-gray-200'
        }`}
    >
      {/* Day header - horizontal with number of events */}
      <div className={`p-3 flex items-center justify-between border-b ${isSelected ? 'bg-blue-50' : isToday ? 'bg-green-50' : 'bg-white'
        }`}>
        <div className="flex items-center space-x-3">
          <div className="text-sm font-medium text-gray-600 w-12">
            {format(day, 'EEE')}
          </div>
          <div className={`text-lg font-semibold ${isSelected ? 'text-blue-600' : isToday ? 'text-green-600' : 'text-gray-900'
            }`}>
            {format(day, 'd')}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {events.length} event{events.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Events of the day */}
      <div className="bg-white p-2 space-y-1">
        {events.length > 0 ? (
          events.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              onSelect={onSelectEvent}
              variant="mobile"
            />
          ))
        ) : (
          <div className="text-sm text-gray-400 text-center py-3">
            No events
          </div>
        )}
      </div>
    </div>
  );
};

const DesktopDayCard: React.FC<DayCardProps> = ({ day, events, isToday, isSelected, onDayClick, onSelectEvent }) => {
  return (
    <div
      onClick={() => onDayClick(day)}
      className={`border rounded-lg overflow-hidden flex flex-col cursor-pointer transition-all ${isSelected
        ? 'border-blue-500 ring-2 ring-blue-200'
        : isToday
          ? 'border-green-500'
          : 'border-gray-200'
        }`}
    >
      {/* Headline of the day */}
      <div className={`p-2 text-center border-b ${isSelected ? 'bg-blue-50' : isToday ? 'bg-green-50' : 'bg-white'
        }`}>
        <div className="text-sm font-medium text-gray-600">
          {format(day, 'EEE')}
        </div>
        <div className={`text-lg font-semibold ${isSelected ? 'text-blue-600' : isToday ? 'text-green-600' : 'text-gray-900'
          }`}>
          {format(day, 'd')}
        </div>
      </div>

      {/* Events of the day */}
      <div className="bg-white p-1 space-y-1 flex-1">
        {events.length > 0 ? (
          events.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              onSelect={onSelectEvent}
              variant="desktop"
            />
          ))
        ) : (
          <div className="text-xs text-gray-400 text-center py-2">
            No events
          </div>
        )}
      </div>
    </div>
  );
};

export const DayViewWithWeek: React.FC<DayViewWithWeekProps> = ({
  date,
  events,
  onSelectEvent,
  selectedDate,
  onDayClick
}) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    return events.filter((event) =>
      format(event.start, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  // On mobile - a vertical list of days
  if (isMobile) {
    return (
      <div className="space-y-2">
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

          return (
            <MobileDayCard
              key={index}
              day={day}
              events={dayEvents}
              isToday={isToday}
              isSelected={isSelected}
              onDayClick={onDayClick}
              onSelectEvent={onSelectEvent}
            />
          );
        })}
      </div>
    );
  }

  // On the desktop - 7-column grid
  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map((day, index) => {
        const dayEvents = getEventsForDay(day);
        const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
        const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

        return (
          <DesktopDayCard
            key={index}
            day={day}
            events={dayEvents}
            isToday={isToday}
            isSelected={isSelected}
            onDayClick={onDayClick}
            onSelectEvent={onSelectEvent}
          />
        );
      })}
    </div>
  );
};