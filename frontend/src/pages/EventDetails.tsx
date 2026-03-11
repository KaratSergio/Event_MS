import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../services/hooks/useEvents';
import { useAuth } from '../services/hooks/useAuth';
import {
  CalendarIcon, MapPinIcon, UserGroupIcon,
  PencilIcon, TrashIcon,
  ChevronLeftIcon, ChevronRightIcon
} from '@heroicons/react/24/outline';
import Modal from '../components/ui/Modal';
import EventForm, { type EventFormData } from '../components/EventForm';
import DeleteConfirmation from '../components/DeleteConfirmation';
import { getErrorMessage } from '../utils/getErrorMessage';
import ErrorState from '../components/ui/ErrorState';
import LoadingState from '../components/ui/LoadingState';
import { formatEventDetails } from '../utils/formatDate';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentEvent, isLoading, error, fetchEventById, joinEvent, leaveEvent, deleteEvent, updateEvent } = useEvents();
  const { user } = useAuth();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState('');

  const isEventPassed = currentEvent ? new Date(currentEvent.dateTime) < new Date() : false;

  useEffect(() => {
    if (id) fetchEventById(id);
  }, [id, fetchEventById]);

  const handleDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      await deleteEvent(id);
      navigate('/events');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleEdit = async (eventData: EventFormData & { dateTime: string }) => {
    if (!id) return;

    setIsUpdating(true);
    setEditError('');

    try {
      await updateEvent(id, {
        title: eventData.title,
        description: eventData.description,
        dateTime: eventData.dateTime,
        location: eventData.location,
        capacity: eventData.capacity ?? null,
        visibility: eventData.visibility,
      });
      setShowEditModal(false);
    } catch (err) {
      setEditError(getErrorMessage(err));
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <LoadingState message="Loading event details..." fullScreen />;
  if (error || !currentEvent) {
    return (
      <ErrorState
        message={error || 'Event not found'}
        onBack={() => navigate(-1)}
        onRetry={() => id && fetchEventById(id)}
        backLabel="Back to Events"
      />
    );
  }

  const { date, time } = formatEventDetails(currentEvent.dateTime);

  return (
    <div className="py-3 sm:py-6">
      <div className="max-w-3xl mx-auto px-3 sm:px-4">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-green-600 mb-3 sm:mb-4 transition-colors group text-sm"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Events</span>
        </button>

        {/* Event Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{currentEvent.title}</h1>

              {currentEvent.canEdit && (
                <div className="flex space-x-1 self-end sm:self-auto">
                  <button
                    onClick={() => setShowEditModal(true)}
                    disabled={isEventPassed}
                    className={`p-1.5 rounded-lg transition-colors ${isEventPassed
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                      }`}
                    aria-label="Edit event"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-1.5 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    aria-label="Delete event"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 space-y-4">
            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed">{currentEvent.description}</p>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg">
                <CalendarIcon className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{date}</p>
                  <p className="text-xs text-gray-600">{time}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg">
                <MapPinIcon className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{currentEvent.location}</p>
                  <p className="text-xs text-gray-600">Location</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg sm:col-span-2">
                <UserGroupIcon className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900">Participants</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${currentEvent.isFull
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                      }`}>
                      {currentEvent.isFull ? 'Full' : `${currentEvent.participantsCount} / ${currentEvent.capacity || '∞'}`}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 rounded-full transition-all duration-300"
                      style={{
                        width: currentEvent.capacity
                          ? `${(currentEvent.participantsCount / currentEvent.capacity) * 100}%`
                          : `${Math.min(currentEvent.participantsCount * 2, 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Organized by:</span>{' '}
                {currentEvent.organizer?.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Created: {new Date(currentEvent.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Join/Leave Button */}
            {currentEvent.organizerId !== user?.id && (
              <div className="pt-3 border-t border-gray-100">
                {isEventPassed ? (
                  <div className="bg-gray-50 text-yellow-700 p-3 rounded-lg text-center text-sm font-medium">
                    This event has already passed
                  </div>
                ) : currentEvent.isFull ? (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg text-center text-sm font-medium">
                    This event is full
                  </div>
                ) : currentEvent.userJoined ? (
                  <button
                    onClick={() => leaveEvent(currentEvent.id)}
                    className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700
          transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <span>Leave Event</span>
                    <ChevronRightIcon className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={() => joinEvent(currentEvent.id)}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
          transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <span>Join Event</span>
                    <ChevronRightIcon className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Participants List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-gray-100">
            <h2 className="text-base sm:text-lg font-semibold flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-1.5 text-green-600" />
              Participants ({currentEvent.participantsCount})
            </h2>
          </div>

          <div className="p-3 sm:p-4">
            {currentEvent.participants && currentEvent.participants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentEvent.participants.map((p) => (
                  <div key={p.userId} className="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center
                      text-white font-semibold text-sm shadow-sm">
                      {(p?.userEmail || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-900">{p?.userEmail || 'Anonymous'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <UserGroupIcon className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No participants yet</p>
                <p className="text-xs text-gray-400 mt-1">Be the first to join!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Event"
        classHeader="hidden"
        classContent="px-0 py-0"
        maxWidth="lg"
      >
        <EventForm
          mode="edit"
          initialData={currentEvent}
          onSubmit={handleEdit}
          onCancel={() => setShowEditModal(false)}
          isSubmitting={isUpdating}
          error={editError}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Event"
        maxWidth="sm"
        showCloseButton={false}
      >
        <DeleteConfirmation
          eventTitle={currentEvent.title}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      </Modal>
    </div>
  );
}