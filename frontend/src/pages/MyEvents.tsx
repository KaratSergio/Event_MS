import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { EventPropGetter } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import {
  ChevronLeftIcon, ChevronRightIcon,
  ListBulletIcon, Squares2X2Icon,
  ClockIcon, MapPinIcon, UserGroupIcon
} from '@heroicons/react/24/outline';
import { useEvents } from '../services/hooks/useEvents';
import { useAuth } from '../services/hooks/useAuth';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import type { CalendarEvent } from '../components/calendar/types';
import { DayViewWithWeek } from '../components/calendar/DayViewWithWeek';
import { EmptyState } from '../components/calendar/EmptyState';
import { getCalendarHeight } from '../components/calendar/utils';
import { injectCalendarStyles } from '../components/calendar/styles';
import LoadingState from '../components/ui/LoadingState';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

injectCalendarStyles();

export default function MyEvents() {
  const navigate = useNavigate();
  const { userEvents, fetchMyEvents, isLoading } = useEvents();
  const { user } = useAuth();
  const [view, setView] = useState<'month' | 'day'>('month');
  const [date, setDate] = useState(new Date());
  const [showMobileList, setShowMobileList] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dayViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMyEvents();

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [fetchMyEvents]);

  // Updating the calendar height when resizing
  useEffect(() => {
    const handleResize = () => setView(prev => prev);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    return userEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.dateTime),
      end: new Date(new Date(event.dateTime).getTime() + 2 * 60 * 60 * 1000), // +2 hours
      resource: {
        ...event,
        location: event.location,
        participantsCount: event.participantsCount,
        isOrganizer: event.organizerId === user?.id,
      },
    }));
  }, [userEvents, user]);

  const handleSelectEvent = (event: CalendarEvent) => {
    navigate(`/events/${event.id}`);
  };

  const handleDayClick = (day: Date) => {
    setDate(day);
  };

  const handleNavigate = (action: 'PREV' | 'NEXT') => {
    const newDate = new Date(date);
    if (view === 'month') {
      if (action === 'PREV') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
    } else {
      if (action === 'PREV') {
        newDate.setDate(newDate.getDate() - 1);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
    }
    setDate(newDate);
  };

  const eventPropGetter: EventPropGetter<CalendarEvent> = (event) => {
    const isOrganizer = event.resource.isOrganizer;
    return {
      className: `cursor-pointer hover:opacity-90 transition-opacity ${isOrganizer ? 'rbc-event-organizer' : 'rbc-event-participant'
        }`,
    };
  };

  if (isLoading) {
    return <LoadingState message="Loading your events..." fullScreen />;
  }

  if (userEvents.length === 0) {
    return <EmptyState onExplore={() => navigate('/events')} />;
  }

  return (
    <div className="sm:py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Header with title and mobile toggle */}
        <div className="flex sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-6">
          {!isMobile && (
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">My Events</h1>
              <p className='text-gray-400'>View and manage your event calendar</p>
            </div>
          )}

          {/* Mobile view toggle */}
          {isMobile && (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setShowMobileList(!showMobileList)}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
              >
                {showMobileList ? (
                  <>
                    <Squares2X2Icon className="w-4 h-4 mr-2" />
                    <span>Calendar</span>
                  </>
                ) : (
                  <>
                    <ListBulletIcon className="w-4 h-4 mr-2" />
                    <span>My Events</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Navigation row - hidden when list ON */}
        {!showMobileList && (
          <div className="flex items-center justify-between mb-3 sm:mb-6">
            {/* Left side with arrows and month/year */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => handleNavigate('PREV')}
                className="p-1 sm:p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <span className="px-2 sm:px-4 py-1 sm:py-1.5 text-sm sm:text-lg font-semibold text-gray-900 min-w-30 sm:min-w-50 text-center">
                {isMobile ? format(date, 'MMM yyyy') : format(date, 'MMMM yyyy')}
              </span>

              <button
                onClick={() => handleNavigate('NEXT')}
                className="p-1 sm:p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Next"
              >
                <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Right side with view toggles */}
            <div className="bg-gray-100 p-0.5 sm:p-1 rounded-lg">
              <button
                onClick={() => setView('month')}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${view === 'month'
                  ? 'bg-green-50 text-green-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {isMobile ? 'M' : 'Month'}
              </button>
              <button
                onClick={() => setView('day')}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${view === 'day'
                  ? 'bg-green-50 text-green-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {isMobile ? 'D' : 'Day'}
              </button>
            </div>
          </div>
        )}

        {/* Calendar/View Area */}
        <div className={`${showMobileList ? 'hidden' : 'block'}`}>
          {view === 'day' ? (
            <div ref={dayViewRef} className="">
              <DayViewWithWeek
                date={date}
                events={calendarEvents}
                onSelectEvent={handleSelectEvent}
                onDayClick={handleDayClick}
                selectedDate={date}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                view={view}
                date={date}
                onView={(newView) => setView(newView as 'month')}
                onNavigate={(newDate) => setDate(newDate)}
                onSelectEvent={handleSelectEvent}
                style={{ height: getCalendarHeight() }}
                views={['month']}
                popup
                selectable
                className="rounded-lg"
                eventPropGetter={eventPropGetter}
                formats={{
                  eventTimeRangeFormat: () => '',
                  timeGutterFormat: (date) => format(date, 'HH:mm'),
                }}
                components={{
                  event: ({ event }) => (
                    <div className="p-0.5 sm:p-1 text-[8px] sm:text-xs truncate">
                      <strong className="block truncate">{(event as CalendarEvent).title}</strong>
                    </div>
                  ),
                }}
              />
            </div>
          )}
        </div>

        {/* Mobile List View */}
        <div className={`${showMobileList ? 'block' : 'hidden'} sm:hidden`}>
          <div className="space-y-2 sm:space-y-4">
            {userEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all"
              >
                <div className={`h-1 sm:h-2 ${event.organizerId === user?.id ? 'bg-purple-600' : 'bg-blue-600'}`} />
                <div className="p-2 sm:p-3 md:p-4">
                  <div className="flex justify-between items-start mb-1 sm:mb-2">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">{event.title}</h3>
                    {event.organizerId === user?.id && (
                      <span className="text-[10px] sm:text-xs bg-purple-100 text-purple-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        Organizer
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-start">
                      <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 mt-0.5 shrink-0 text-gray-400" />
                      <div>
                        <p className="text-xs sm:text-sm">{format(new Date(event.dateTime), 'EEE, MMM d, yyyy')}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          {format(new Date(event.dateTime), 'h:mm a')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0 text-gray-400" />
                      <span className="text-xs sm:text-sm line-clamp-1">{event.location}</span>
                    </div>

                    <div className="flex items-center">
                      <UserGroupIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0 text-gray-400" />
                      <span className="text-xs sm:text-sm">
                        {event.participantsCount} participant{event.participantsCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}