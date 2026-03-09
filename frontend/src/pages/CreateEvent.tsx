import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../services/hooks/useEvents';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import CreateEventForm, { type EventFormData } from '../components/forms/CreateEventForm';

export default function CreateEvent() {
  const navigate = useNavigate();
  const { createEvent, isLoading } = useEvents();
  const [error, setError] = useState('');

  const handleSubmit = async (data: EventFormData) => {
    try {
      const dateTime = new Date(`${data.date}T${data.time}`);

      if (dateTime < new Date()) {
        setError('Cannot create event in the past');
        return;
      }

      await createEvent({
        title: data.title,
        description: data.description,
        dateTime: dateTime.toISOString(),
        location: data.location,
        capacity: data.capacity ? Number(data.capacity) : null,
        visibility: data.visibility,
      });

      navigate('/events');
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    }
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-green-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <p>Back</p>
        </div>

        {/* Form Component */}
        <CreateEventForm
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}