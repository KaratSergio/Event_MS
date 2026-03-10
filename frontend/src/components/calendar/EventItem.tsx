import { format } from 'date-fns/format';
import type { CalendarEvent } from './types';

interface EventItemProps {
  event: CalendarEvent;
  onSelect: (event: CalendarEvent) => void;
  variant: 'mobile' | 'desktop';
}

export const EventItem: React.FC<EventItemProps> = ({ event, onSelect, variant }) => {
  const baseClasses = `rounded cursor-pointer transition-colors ${event.resource.isOrganizer
    ? 'bg-purple-100 hover:bg-purple-200 border-l-4 border-purple-600'
    : 'bg-blue-100 hover:bg-yellow-200 border-l-4 border-yellow-600'
    }`;

  const mobileClasses = "p-2";
  const desktopClasses = "p-1";

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(event);
      }}
      className={`${baseClasses} ${variant === 'mobile' ? mobileClasses : desktopClasses}`}
    >
      <div className={`font-medium truncate ${variant === 'mobile' ? 'text-sm' : 'text-xs'}`}>
        {event.title}
      </div>
      <div className={`text-gray-600 ${variant === 'mobile' ? 'text-xs' : 'text-[10px]'}`}>
        {format(event.start, 'HH:mm')}
      </div>
    </div>
  );
};