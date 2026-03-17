import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

export default function BackButton({
  to = '/events',
  label = 'Back to Events',
  className = ''
}: BackButtonProps) {
  const navigate = useNavigate();
  const handleClick = () => navigate(to);

  return (
    <button
      onClick={handleClick}
      className={`flex items-center text-gray-600 hover:text-green-600 mb-3 sm:mb-4 transition-colors group text-sm ${className}`}
    >
      <ChevronLeftIcon className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
      <span className="text-sm">{label}</span>
    </button>
  );
}