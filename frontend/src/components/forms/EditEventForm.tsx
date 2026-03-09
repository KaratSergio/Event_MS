import { useForm } from 'react-hook-form';
import { CalendarIcon, MapPinIcon, UserGroupIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

interface EditEventFormProps {
  event: {
    id: string;
    title: string;
    description: string;
    dateTime: string;
    location: string;
    capacity?: number | null;
  };
  onSubmit: (eventData: any) => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
}

export default function EditEventForm({ event, onSubmit, onCancel }: EditEventFormProps) {
  // Разделяем dateTime на date и time для initial values
  const eventDate = new Date(event.dateTime);
  const formattedDate = eventDate.toISOString().split('T')[0];
  const formattedTime = eventDate.toTimeString().slice(0, 5);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch
  } = useForm<FormData>({
    defaultValues: {
      title: event.title,
      description: event.description,
      date: formattedDate,
      time: formattedTime,
      location: event.location,
      capacity: event.capacity?.toString() || '',
    }
  });

  // Следим за изменениями даты и времени для валидации
  const selectedDate = watch('date');
  const selectedTime = watch('time');

  const onFormSubmit = async (data: FormData) => {
    try {
      // Объединяем date и time обратно в ISO строку
      const dateTime = new Date(`${data.date}T${data.time}`);

      // Проверяем, что дата не в прошлом
      if (dateTime < new Date()) {
        setError('root', {
          message: 'Event date must be in the future'
        });
        return;
      }

      await onSubmit({
        title: data.title,
        description: data.description,
        dateTime: dateTime.toISOString(),
        location: data.location,
        capacity: data.capacity ? parseInt(data.capacity, 10) : null,
      });
    } catch (error) {
      setError('root', {
        message: 'Failed to update event. Please try again.'
      });
    }
  };

  // Валидация даты (не в прошлом)
  const validateDate = (date: string) => {
    if (!date) return 'Date is required';

    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      return 'Date cannot be in the past';
    }
    return true;
  };

  // Валидация времени для выбранной даты
  const validateTime = (time: string) => {
    if (!time) return 'Time is required';

    if (selectedDate) {
      const selectedDateTime = new Date(`${selectedDate}T${time}`);
      const now = new Date();

      if (selectedDateTime < now) {
        return 'Time cannot be in the past';
      }
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Event Title *
        </label>
        <input
          type="text"
          id="title"
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters'
            }
          })}
          className={`w-full px-3 py-2 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent
            ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter event title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          rows={3}
          {...register('description', {
            required: 'Description is required',
            minLength: {
              value: 10,
              message: 'Description must be at least 10 characters'
            }
          })}
          className={`w-full px-3 py-2 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent
            ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Describe your event"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Date and Time  */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1 text-gray-500" />
              Date *
            </div>
          </label>
          <input
            type="date"
            id="date"
            {...register('date', {
              required: 'Date is required',
              validate: validateDate
            })}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent
              ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div className="flex-1">
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
            Time *
          </label>
          <input
            type="time"
            id="time"
            {...register('time', {
              required: 'Time is required',
              validate: validateTime
            })}
            className={`w-full px-3 py-2 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent
              ${errors.time ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.time && (
            <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-1 text-gray-500" />
            Location *
          </div>
        </label>
        <input
          type="text"
          id="location"
          {...register('location', {
            required: 'Location is required',
            minLength: {
              value: 3,
              message: 'Location must be at least 3 characters'
            }
          })}
          className={`w-full px-3 py-2 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent
            ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter location"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      {/* Capacity */}
      <div>
        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center">
            <UserGroupIcon className="w-4 h-4 mr-1 text-gray-500" />
            Capacity (leave empty for unlimited)
          </div>
        </label>
        <input
          type="number"
          id="capacity"
          min="1"
          {...register('capacity', {
            validate: (value) => {
              if (value) {
                const num = parseInt(value, 10);
                if (isNaN(num) || num < 1) {
                  return 'Capacity must be at least 1';
                }
              }
              return true;
            }
          })}
          className={`w-full px-3 py-2 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent
            ${errors.capacity ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="e.g., 50"
        />
        {errors.capacity && (
          <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Maximum number of participants. Leave empty for unlimited.
        </p>
      </div>

      {/* Error message */}
      {errors.root && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.root.message}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <PencilSquareIcon className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}