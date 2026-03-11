interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingState({
  message = 'Loading...',
  fullScreen = false,
  className = '',
  size = 'md'
}: LoadingStateProps) {
  const spinnerSizes = {
    sm: 'h-4 w-4 sm:h-5 sm:w-5',
    md: 'h-6 w-6 sm:h-8 sm:w-8',
    lg: 'h-8 w-8 sm:h-10 sm:w-10'
  };

  const textSizes = {
    sm: 'text-xs sm:text-sm',
    md: 'text-xs sm:text-sm md:text-base',
    lg: 'text-sm sm:text-base md:text-lg'
  };

  const containerClasses = fullScreen
    ? 'min-h-screen bg-gray-50 flex items-center justify-center p-4'
    : 'flex items-center justify-center p-4 sm:p-6';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <div className={`inline-block ${spinnerSizes[size]} animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent`}></div>
        <p className={`mt-2 sm:mt-3 ${textSizes[size]} text-gray-600`}>{message}</p>
      </div>
    </div>
  );
}