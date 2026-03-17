import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../services/hooks/useEvents';
import EventForm from '../components/EventForm';
import { getErrorMessage } from '../utils/getErrorMessage';
import type { CreateEventDto } from '../services';
import BackButton from '../components/ui/BackButton';

export default function CreateEvent() {
  const navigate = useNavigate();
  const { createEvent, isLoading } = useEvents();
  const [error, setError] = useState('');

  const handleSubmit = async (data: CreateEventDto) => {
    try {
      const newEvent = await createEvent(data);
      navigate(`/events/${newEvent.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <BackButton to="/events" label="Back to Events" className='sm:not-open:ml-6' />

        <EventForm
          mode="create"
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}