import { useForm } from 'react-hook-form';
import {
  CalendarIcon, MapPinIcon, UserGroupIcon,
  GlobeAltIcon, LockClosedIcon, XCircleIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity?: number | null;
  visibility: 'public' | 'private';
}

interface EventFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<EventFormData> & { dateTime?: string };
  onSubmit: (data: EventFormData & { dateTime: string }) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  error?: string;
}

export default function EventForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error: externalError
}: EventFormProps) {
  const getDefaultValues = () => {
    if (mode === 'edit' && initialData?.dateTime) {
      const eventDate = new Date(initialData.dateTime);
      return {
        title: initialData.title || '',
        description: initialData.description || '',
        date: eventDate.toISOString().split('T')[0],
        time: eventDate.toTimeString().slice(0, 5),
        location: initialData.location || '',
        capacity: initialData.capacity ?? null,
        visibility: initialData.visibility || 'public',
      };
    }

    return {
      visibility: 'public' as const,
      capacity: null,
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError
  } = useForm<EventFormData>({
    defaultValues: getDefaultValues()
  });

  const selectedDate = watch('date');
  const selectedTime = watch('time');

  const validateDate = (date: string) => {
    if (!date) return 'Date is required';

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return 'Date cannot be in the past';
    }
    return true;
  };

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

  const onFormSubmit = async (data: EventFormData) => {
    try {
      const dateTime = new Date(`${data.date}T${data.time}`).toISOString();

      if (mode === 'edit') {
        const selectedDateTime = new Date(dateTime);
        if (selectedDateTime < new Date()) {
          setError('root', {
            message: 'Event date must be in the future'
          });
          return;
        }
      }

      await onSubmit({
        ...data,
        dateTime
      });
    } catch (error) {
      setError('root', {
        message: `Failed to ${mode} event. Please try again.`
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 space-y-4 max-w-xl mx-auto w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0">
        {mode === 'create' ? 'Create New Event' : 'Edit Event'}
      </h1>
      <p className="text-sm text-gray-400">
        {mode === 'create'
          ? 'Fill in the details to create an amazing event'
          : 'Update your event details'}
      </p>

      {/* Error message */}
      {(externalError || errors.root) && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md">
          <div className="flex">
            <div className="shrink-0">
              <XCircleIcon className="h-4 w-4 text-red-400" />
            </div>
            <div className="ml-2">
              <p className="text-xs text-red-700">{externalError || errors.root?.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-xs font-medium text-gray-700 mb-1">
          Event Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters'
            }
          })}
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-green-500 transition-colors ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          placeholder="e.g., Tech Conference 2026"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...register('description', {
            minLength: {
              value: 10,
              message: 'Description must be at least 10 characters'
            },
            maxLength: {
              value: 500,
              message: 'Description cannot exceed 500 characters'
            }
          })}
          className="w-full px-3 py-2 text-sm border bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:ring-2
          focus:ring-green-500 transition-colors resize-none"
          placeholder="Describe what makes your event special..."
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Date and Time */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="date" className="block text-xs font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <CalendarIcon className="w-3 h-3 mr-1 text-gray-500" />
              Date <span className="text-red-500 ml-1">*</span>
            </div>
          </label>
          <input
            id="date"
            type="date"
            {...register('date', {
              required: 'Date is required',
              validate: validateDate
            })}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 text-sm border bg-gray-50 rounded-lg focus:outline-none focus:ring-2
              focus:ring-green-500 transition-colors ${errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
          />
          {errors.date && (
            <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div className="flex-1">
          <label htmlFor="time" className="block text-xs font-medium text-gray-700 mb-1">
            Time <span className="text-red-500">*</span>
          </label>
          <input
            id="time"
            type="time"
            {...register('time', {
              required: 'Time is required',
              validate: validateTime
            })}
            className={`w-full px-3 py-2 text-sm border bg-gray-50 rounded-lg focus:outline-none focus:ring-2
            focus:ring-green-500 transition-colors ${errors.time ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
          />
          {errors.time && (
            <p className="mt-1 text-xs text-red-600">{errors.time.message}</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-xs font-medium text-gray-700 mb-1">
          <div className="flex items-center">
            <MapPinIcon className="w-3 h-3 mr-1 text-gray-500" />
            Location <span className="text-red-500 ml-1">*</span>
          </div>
        </label>
        <input
          id="location"
          type="text"
          {...register('location', {
            required: 'Location is required',
            minLength: {
              value: 3,
              message: 'Location must be at least 3 characters'
            }
          })}
          className={`w-full px-3 py-2 text-sm border bg-gray-50 rounded-lg focus:outline-none focus:ring-2
            focus:ring-green-500 transition-colors ${errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          placeholder="e.g., Convention Center, San Francisco"
        />
        {errors.location && (
          <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>
        )}
      </div>

      {/* Capacity */}
      <div>
        <label htmlFor="capacity" className="block text-xs font-medium text-gray-700 mb-1">
          <div className="flex items-center">
            <UserGroupIcon className="w-3 h-3 mr-1 text-gray-500" />
            Capacity <span className="text-gray-400 text-xs ml-1">(optional)</span>
          </div>
        </label>
        <input
          id="capacity"
          type="number"
          min="1"
          {...register('capacity', {
            setValueAs: (v) => {

              if (v === '' || v === null || v === undefined) return null;
              const num = Number(v);
              return isNaN(num) ? null : num;
            },
            validate: (value) => {
              if (value == null) return true;
              if (value < 1) return 'Capacity must be at least 1';
              if (!Number.isInteger(value)) return 'Capacity must be a whole number';
              return true;
            }
          })}
          className={`w-full px-3 py-2 text-sm border bg-gray-50 rounded-lg focus:outline-none focus:ring-2
            focus:ring-green-500 transition-colors ${errors.capacity ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
          placeholder="Leave empty for unlimited"
        />
        {errors.capacity && (
          <p className="mt-1 text-xs text-red-600">{errors.capacity.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Maximum number of participants. Leave empty for unlimited.
        </p>
      </div>

      {/* Visibility */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Visibility
        </label>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <label className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex-1">
            <input
              type="radio"
              value="public"
              {...register('visibility')}
              className="mr-2 w-3 h-3 text-green-600"
            />
            <div className="flex items-center">
              <GlobeAltIcon className="w-4 h-4 text-gray-500 mr-1" />
              <div>
                <span className="text-sm font-medium text-gray-700">Public</span>
                <p className="text-xs text-gray-500">Anyone can see and join</p>
              </div>
            </div>
          </label>
          <label className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex-1">
            <input
              type="radio"
              value="private"
              {...register('visibility')}
              className="mr-2 w-3 h-3 text-green-600"
            />
            <div className="flex items-center">
              <LockClosedIcon className="w-4 h-4 text-gray-500 mr-1" />
              <div>
                <span className="text-sm font-medium text-gray-700">Private</span>
                <p className="text-xs text-gray-500">Only invited can see</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 rounded-lg
            text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-4 py-2 text-sm bg-green-600 text-white rounded-lg font-medium
          hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              {mode === 'create' ? 'Creating...' : 'Saving...'}
            </>
          ) : (
            <>
              {mode === 'create' ? (
                'Create Event'
              ) : (
                <>
                  <PencilSquareIcon className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </>
          )}
        </button>
      </div>
    </form>
  );
}