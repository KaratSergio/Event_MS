import { Link, useLocation } from 'react-router-dom';
import {
  CalendarIcon, UserGroupIcon, PlusCircleIcon,
  ArrowLeftEndOnRectangleIcon, ArrowRightEndOnRectangleIcon,
  Bars3Icon, XMarkIcon
} from '@heroicons/react/24/outline';

interface BurgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  user: { email: string } | null;
  onLogout: () => void;
}

export default function BurgerMenu({ isOpen, onToggle, onClose, user, onLogout }: BurgerMenuProps) {
  const location = useLocation();

  const getInitial = () => {
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return '?';
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Button */}
      <button
        onClick={onToggle}
        className="md:hidden p-2 rounded-lg hover:bg-green-100 transition-colors relative z-50"
        aria-label="Toggle menu"
      >
        <div className="relative w-6 h-6">
          <Bars3Icon
            className={`absolute inset-0 w-6 h-6 transform transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
              }`}
          />
          <XMarkIcon
            className={`absolute inset-0 w-6 h-6 transform transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
              }`}
          />
        </div>
      </button>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ease-in-out ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
      >
        {/* background */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${isOpen ? 'opacity-50' : 'opacity-0'
            }`}
          onClick={onClose}
        />

        {/* menu */}
        <div
          className={`absolute top-0 right-0 w-64 h-full bg-white shadow-xl transform transition-all duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* decor */}
          <div
            className={`absolute left-40 top-1/3 w-24 h-24 bg-red-500 transform rotate-45 transition-all duration-1000 delay-600 ${isOpen ? 'scale-100 opacity-20' : 'scale-0 opacity-0'
              }`}
          />
          <div
            className={`absolute left-10 top-1/2 w-20 h-20 bg-yellow-500 transform rotate-45 transition-all duration-400 delay-360 ${isOpen ? 'scale-100 opacity-20' : 'scale-0 opacity-0'
              }`}
          />
          <div
            className={`absolute -right-10 bottom-20 w-32 h-32 bg-blue-400 transform rotate-45 transition-all duration-800 delay-500 ${isOpen ? 'scale-100 opacity-20' : 'scale-0 opacity-0'
              }`}
          />

          <div className="p-6 pt-20 relative z-10">
            {/* Profile */}
            {user ? (
              <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-green-700">
                      {getInitial()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-8 pb-6 border-b border-gray-200">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center space-x-3 text-green-600 hover:text-green-700"
                >
                  <ArrowLeftEndOnRectangleIcon className="w-6 h-6" />
                  <span className="font-medium">Sign In</span>
                </Link>
              </div>
            )}

            {/* Navigation */}
            <div className="space-y-4">
              <Link
                to="/events"
                onClick={onClose}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive('/events')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-green-50'
                  }`}
              >
                <CalendarIcon className="w-5 h-5" />
                <span className="font-medium">Events</span>
              </Link>

              {user && (
                <Link
                  to="/my-events"
                  onClick={onClose}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive('/my-events')
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-green-50'
                    }`}
                >
                  <UserGroupIcon className="w-5 h-5" />
                  <span className="font-medium">My Events</span>
                </Link>
              )}

              <Link
                to="/create-event"
                onClick={onClose}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive('/create-event')
                  ? 'bg-green-100 text-green-700'
                  : 'text-white bg-green-600 hover:bg-green-700'
                  }`}
              >
                <PlusCircleIcon className="w-5 h-5" />
                <span className="font-medium">Create Event</span>
              </Link>

              {user && (
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="flex items-center space-x-3 p-3 w-full text-left text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}