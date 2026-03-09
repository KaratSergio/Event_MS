import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import { useEvents } from '../services/hooks/useEvents';
import { useAuth } from '../services/hooks/useAuth';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListBulletIcon,
  Squares2X2Icon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const calendarStyles = {
  height: 600,
};

export default function MyEvents() {
  const navigate = useNavigate();
  const { userEvents, fetchMyEvents, isLoading } = useEvents();
  const { user } = useAuth();
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [date, setDate] = useState(new Date());
  const [showMobileList, setShowMobileList] = useState(false);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  const calendarEvents = useMemo(() => {
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

  const handleSelectEvent = (event: any) => {
    navigate(`/events/${event.id}`);
  };

  const handleNavigate = (action: 'TODAY' | 'PREV' | 'NEXT') => {
    const newDate = new Date(date);
    switch (action) {
      case 'TODAY':
        setDate(new Date());
        break;
      case 'PREV':
        if (view === 'month') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else if (view === 'week') {
          newDate.setDate(newDate.getDate() - 7);
        } else {
          newDate.setDate(newDate.getDate() - 1);
        }
        setDate(newDate);
        break;
      case 'NEXT':
        if (view === 'month') {
          newDate.setMonth(newDate.getMonth() + 1);
        } else if (view === 'week') {
          newDate.setDate(newDate.getDate() + 7);
        } else {
          newDate.setDate(newDate.getDate() + 1);
        }
        setDate(newDate);
        break;
    }
  };

  const formatDateRange = () => {
    if (view === 'month') {
      return format(date, 'MMMM yyyy');
    } else if (view === 'week') {
      const start = startOfWeek(date, { weekStartsOn: 1 });
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    } else {
      return format(date, 'EEEE, MMMM d, yyyy');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your events...</p>
        </div>
      </div>
    );
  }

  if (userEvents.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <CalendarIcon className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No events yet</h2>
            <p className="text-gray-600 mb-8">
              You are not part of any events yet. Explore public events and join!
            </p>
            <button
              onClick={() => navigate('/events')}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg
                hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <span>Explore Events</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Events</h1>

          {/* View Toggle  */}
          <div className="flex items-center justify-between sm:justify-end gap-4">
            {/* Mobile/Desktop toggle */}
            <button
              onClick={() => setShowMobileList(!showMobileList)}
              className="sm:hidden flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg"
            >
              {showMobileList ? (
                <>
                  <Squares2X2Icon className="w-5 h-5 mr-2" />
                  <span>Calendar</span>
                </>
              ) : (
                <>
                  <ListBulletIcon className="w-5 h-5 mr-2" />
                  <span>List</span>
                </>
              )}
            </button>

            {/* View buttons - showMobileList = true */}
            <div className={`${showMobileList ? 'hidden' : 'flex'} sm:flex bg-gray-100 p-1 rounded-lg`}>
              <button
                onClick={() => setView('month')}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'month'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Month
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'week'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Week
              </button>
              <button
                onClick={() => setView('day')}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'day'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Day
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleNavigate('TODAY')}
              className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Today
            </button>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleNavigate('PREV')}
                className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleNavigate('NEXT')}
                className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Next"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-700">{formatDateRange()}</h2>
        </div>

        {/* Calendar View - Desktop/Tablet */}
        <div className={`${showMobileList ? 'hidden' : 'block'} sm:block`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              view={view}
              date={date}
              onView={(newView) => setView(newView as 'month' | 'week' | 'day')}
              onNavigate={(newDate) => setDate(newDate)}
              onSelectEvent={handleSelectEvent}
              style={calendarStyles}
              views={['month', 'week', 'day']}
              popup
              selectable
              className="rounded-lg"
              eventPropGetter={(event) => ({
                className: `cursor-pointer hover:opacity-90 transition-opacity ${event.resource.isOrganizer
                  ? 'bg-purple-600 border-purple-700'
                  : 'bg-blue-600 border-blue-700'
                  }`,
              })}
              formats={{
                eventTimeRangeFormat: () => '',
                timeGutterFormat: (date) => format(date, 'HH:mm'),
              }}
              components={{
                event: ({ event }) => (
                  <div className="p-1 text-xs truncate">
                    <strong>{event.title}</strong>
                    {view !== 'month' && (
                      <div className="text-[10px] opacity-80">
                        {format(event.start, 'HH:mm')}
                      </div>
                    )}
                  </div>
                ),
              }}
            />
          </div>
        </div>

        {/* Mobile List View */}
        <div className={`${showMobileList ? 'block' : 'hidden'} sm:hidden`}>
          <div className="space-y-4">
            {userEvents.map(event => (
              <div
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all"
              >
                {/* Event Image/Color Bar */}
                <div className={`h-2 ${event.organizerId === user?.id ? 'bg-purple-600' : 'bg-blue-600'
                  }`} />

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    {event.organizerId === user?.id && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        Organizer
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start">
                      <ClockIcon className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-gray-400" />
                      <div>
                        <p>{format(new Date(event.dateTime), 'EEEE, MMMM d, yyyy')}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(event.dateTime), 'h:mm a')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                      <span className="text-sm line-clamp-1">{event.location}</span>
                    </div>

                    <div className="flex items-center">
                      <UserGroupIcon className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                      <span className="text-sm">
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