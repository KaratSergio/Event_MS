import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEventStore } from '../store/eventStore';
import { useAuthStore } from '../store/authStore';
import {
  CalendarIcon, MapPinIcon, UserGroupIcon,
  PencilIcon, TrashIcon, ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentEvent, isLoading, error, fetchEventById, joinEvent, leaveEvent, deleteEvent } = useEventStore();
  const { user } = useAuthStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventById(id);
    }
  }, [id]);

  const handleDelete = async () => {
    if (id) {
      await deleteEvent(id);
      navigate('/events');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading event details...</div>
      </div>
    );
  }

  if (error || !currentEvent) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        Error: {error || 'Event not found'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/events')}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Events
      </button>

      {/* Event Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold">{currentEvent.title}</h1>

          {currentEvent.canEdit && (
            <div className="flex space-x-2">
              <Link
                to={`/events/${id}/edit`}
                className="p-2 text-gray-600 hover:text-blue-600 rounded"
              >
                <PencilIcon className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-gray-600 hover:text-red-600 rounded"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-600 mt-4">{currentEvent.description}</p>

        <div className="mt-6 space-y-3">
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="w-5 h-5 mr-3" />
            <span>
              {new Date(currentEvent.dateTime).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPinIcon className="w-5 h-5 mr-3" />
            <span>{currentEvent.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <UserGroupIcon className="w-5 h-5 mr-3" />
            <span>
              {currentEvent.participantsCount} / {currentEvent.capacity || '∞'} participants
              {currentEvent.isFull && ' (Full)'}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="text-sm text-gray-500">
            Organized by: {currentEvent.organizer?.name || currentEvent.organizer?.email}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Created: {new Date(currentEvent.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Join/Leave Button */}
        {currentEvent.organizerId !== user?.id && (
          <div className="mt-6">
            {currentEvent.isFull ? (
              <span className="inline-block px-6 py-3 bg-red-100 text-red-600 rounded-lg font-medium">
                Event is Full
              </span>
            ) : currentEvent.userJoined ? (
              <button
                onClick={() => leaveEvent(currentEvent.id)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Leave Event
              </button>
            ) : (
              <button
                onClick={() => joinEvent(currentEvent.id)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Join Event
              </button>
            )}
          </div>
        )}
      </div>

      {/* Participants List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Participants ({currentEvent.participantsCount})</h2>

        {currentEvent.participants && currentEvent.participants.length > 0 ? (
          <div className="space-y-2">
            {currentEvent.participants.map((p) => (
              <div key={p.userId} className="flex items-center p-2 bg-gray-50 rounded">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  {(p.userName || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="ml-3">{p.userName || 'Anonymous'}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No participants yet</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Event</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}