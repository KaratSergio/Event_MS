import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import { useEventStore } from '../store/eventStore';
import { useAuthStore } from '../store/authStore';
import { CalendarIcon } from '@heroicons/react/24/outline';

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

export default function MyEvents() {
  const navigate = useNavigate();
  const { userEvents, fetchUserEvents, isLoading } = useEventStore();
  const { user } = useAuthStore();
  const [view, setView] = useState<'month' | 'week'>('month');

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const calendarEvents = userEvents.map(event => ({
    id: event.id,
    title: event.title,
    start: new Date(event.dateTime),
    end: new Date(new Date(event.dateTime).getTime() + 2 * 60 * 60 * 1000), // +2 hours
    resource: event,
  }));

  const handleSelectEvent = (event: any) => {
    navigate(`/events/${event.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading your events...</div>
      </div>
    );
  }

  if (userEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No events yet</h2>
        <p className="text-gray-500 mb-6">
          You are not part of any events yet. Explore public events and join!
        </p>
        <button
          onClick={() => navigate('/events')}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Explore Events
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Events</h1>

        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded-md transition ${view === 'month' ? 'bg-white shadow' : 'text-gray-600'
              }`}
          >
            Month
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-md transition ${view === 'week' ? 'bg-white shadow' : 'text-gray-600'
              }`}
          >
            Week
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={(newView) => setView(newView as 'month' | 'week')}
          onSelectEvent={handleSelectEvent}
          style={{ height: 600 }}
          views={['month', 'week']}
          popup
          selectable
          className="rounded-lg"
        />
      </div>

      {/* List of events (for mobile) */}
      <div className="mt-8 md:hidden">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        <div className="space-y-3">
          {userEvents.map(event => (
            <div
              key={event.id}
              onClick={() => navigate(`/events/${event.id}`)}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition"
            >
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(event.dateTime).toLocaleDateString()} at{' '}
                {new Date(event.dateTime).toLocaleTimeString()}
              </p>
              <p className="text-xs text-gray-500 mt-2">{event.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}