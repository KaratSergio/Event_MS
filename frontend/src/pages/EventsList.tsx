import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEventStore } from '../store/eventStore';
import { useAuthStore } from '../store/authStore';
import { CalendarIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function EventsList() {
  const { events, isLoading, error, fetchPublicEvents, joinEvent, leaveEvent } = useEventStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPublicEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Public Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <Link to={`/events/${event.id}`}>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {new Date(event.dateTime).toLocaleDateString()} at {new Date(event.dateTime).toLocaleTimeString()}
                  </div>

                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>

                  <div className="flex items-center">
                    <UserGroupIcon className="w-4 h-4 mr-2" />
                    {event.participantsCount} / {event.capacity || '∞'} participants
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  Organized by: {event.organizer?.name || event.organizer?.email}
                </div>
              </div>
            </Link>

            <div className="px-6 pb-6">
              {event.organizerId === user?.id ? (
                <span className="inline-block px-4 py-2 bg-gray-100 text-gray-600 rounded text-sm">
                  You are the organizer
                </span>
              ) : event.isFull ? (
                <span className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded text-sm">
                  Event Full
                </span>
              ) : event.userJoined ? (
                <button
                  onClick={() => leaveEvent(event.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Leave
                </button>
              ) : (
                <button
                  onClick={() => joinEvent(event.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Join
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No public events available
        </div>
      )}
    </div>
  );
}