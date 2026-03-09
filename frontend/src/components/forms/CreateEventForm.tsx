import { useForm } from 'react-hook-form';
import { CalendarIcon, MapPinIcon, UserGroupIcon, GlobeAltIcon, LockClosedIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface CreateEventFormProps {
  onSubmit: (data: EventFormData) => Promise<void>;
  isSubmitting?: boolean;
  error?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  visibility: 'public' | 'private';
}

export default function CreateEventForm({ onSubmit, isSubmitting = false, error: externalError }: CreateEventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger
  } = useForm<EventFormData>({
    defaultValues: {
      visibility: 'public',
      capacity: 1,
    },
  });

  // Handle capacity change to ensure it's always a valid number
  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setValue('capacity', 1);
    } else {
      const num = parseInt(value, 10);
      if (!isNaN(num)) setValue('capacity', num);
    }
    trigger('capacity');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 space-y-4 max-w-xl mx-auto w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0">Create New Event</h1>
      <p className="text-sm text-gray-400">Fill in the details to create an amazing event</p>

      {/* Error message */}
      {externalError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md">
          <div className="flex">
            <div className="shrink-0">
              <XCircleIcon className="h-4 w-4 text-red-400" />
            </div>
            <div className="ml-2">
              <p className="text-xs text-red-700">{externalError}</p>
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
          placeholder="Enter event title"
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
            maxLength: {
              value: 500,
              message: 'Description cannot exceed 500 characters'
            }
          })}
          className="w-full px-3 py-2 text-sm border bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:ring-2
          focus:ring-green-500 transition-colors resize-none"
          placeholder="Describe your event..."
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
              validate: (value) => {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate < today) {
                  return 'Date cannot be in the past';
                }
                return true;
              }
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
              validate: (value, formValues) => {
                if (formValues.date) {
                  const selectedDateTime = new Date(`${formValues.date}T${value}`);
                  const now = new Date();
                  if (selectedDateTime < now) {
                    return 'Event time must be in the future';
                  }
                }
                return true;
              }
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
          placeholder="Enter location"
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
            Capacity <span className="text-red-500 ml-1">*</span>
          </div>
        </label>
        <input
          id="capacity"
          type="number"
          min="1"
          {...register('capacity', {
            required: 'Capacity is required',
            validate: (value) => {
              const num = Number(value);
              if (isNaN(num)) return 'Capacity must be a valid number';
              if (num < 1) return 'Capacity must be at least 1';
              if (!Number.isInteger(num)) return 'Capacity must be a whole number';
              return true;
            }
          })}
          onChange={handleCapacityChange}
          className={`w-full px-3 py-2 text-sm border bg-gray-50 rounded-lg focus:outline-none focus:ring-2
          focus:ring-green-500 transition-colors ${errors.capacity ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
          placeholder="Enter capacity"
        />
        {errors.capacity && (
          <p className="mt-1 text-xs text-red-600">{errors.capacity.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Maximum number of participants. Must be at least 1.
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
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 rounded-lg
          text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-4 py-2 text-sm bg-green-600 text-white rounded-lg font-medium
          hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Creating...
            </>
          ) : (
            'Create Event'
          )}
        </button>
      </div>
    </form>
  );
}