import { CalendarIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  onExplore: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onExplore }) => {
  return (
    <div className="flex items-center justify-center p-2 sm:p-4 min-h-100">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 bg-blue-100 rounded-full mb-4 sm:mb-6">
            <CalendarIcon className="w-6 h-6 sm:w-10 sm:h-10 text-green-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">No events yet</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-8 px-2">
            You are not part of any events yet. Explore public events and join!
          </p>
          <button
            onClick={onExplore}
            className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg text-sm sm:text-base
              hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <span>Explore Events</span>
            <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};