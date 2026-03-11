import { XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface ErrorStateProps {
  message: string;
  onBack?: () => void;
  backLabel?: string;
  fullScreen?: boolean;
  className?: string;
  onRetry?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showBackButton?: boolean;
}

export default function ErrorState({
  message,
  onBack,
  backLabel = 'Back',
  fullScreen = false,
  className = '',
  onRetry,
  size = 'md',
  showBackButton = true
}: ErrorStateProps) {
  const iconSizes = {
    sm: 'h-3 w-3 sm:h-4 sm:w-4',
    md: 'h-4 w-4 sm:h-5 sm:w-5',
    lg: 'h-5 w-5 sm:h-6 sm:w-6'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-xs sm:text-sm',
    lg: 'text-sm sm:text-base'
  };

  const containerClasses = fullScreen
    ? 'min-h-screen bg-gray-50 p-3 sm:p-4'
    : 'p-3 sm:p-4';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="max-w-3xl mx-auto">
        {/* onBack and showBackButton=true */}
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-green-600 mb-4 text-sm transition-colors group"
          >
            <ArrowLeftIcon className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
            {backLabel}
          </button>
        )}

        {/* Error message */}
        <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded-lg">
          <div className="flex items-start">
            <XCircleIcon className={`${iconSizes[size]} text-red-400 shrink-0 mr-2 mt-0.5`} />
            <div className="flex-1">
              <p className={`${textSizes[size]} text-red-700`}>{message}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`mt-1 sm:mt-2 ${textSizes[size]} text-red-600 hover:text-red-800 underline`}
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}