import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import {
  CalendarIcon, UserGroupIcon, PlusCircleIcon,
  ArrowLeftEndOnRectangleIcon, ArrowRightEndOnRectangleIcon
} from '@heroicons/react/24/outline';
import BurgerMenu from '../components/BurgerMenu';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getInitial = () => {
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return '?';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/events" className="block">
                <div className="inline-flex items-center justify-center size-12 bg-green-600 rounded-lg shadow-lg">
                  <span className="text-lg font-semibold text-white">EM</span>
                </div>
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Events */}
              <Link
                to="/events"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive('/events')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                  }`}
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                <span>Events</span>
              </Link>

              {/* My Events (auth) */}
              {user && (
                <Link
                  to="/my-events"
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive('/my-events')
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                    }`}
                >
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  <span>My Events</span>
                </Link>
              )}

              {/* Create Event */}
              <Link
                to="/create-event"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive('/create-event')
                  ? 'bg-green-100 text-green-700'
                  : 'text-white bg-green-600 hover:bg-green-700'
                  }`}
              >
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                <span>Create Event</span>
              </Link>

              {/* | */}
              <div className="h-6 w-px bg-gray-300 mx-2"></div>

              {/* Profile */}
              {user ? (
                <>
                  {/* Avatar */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-green-700">
                          {getInitial()}
                        </span>
                      </div>
                      <span className="hidden lg:inline text-sm text-gray-600">
                        {user.email}
                      </span>
                    </div>

                    {/* logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-3 py-2 text-sm font-medium cursor-pointer text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Logout"
                    >
                      <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`flex items-center px-3 py-2 text-sm font-medium cursor-pointer rounded-lg transition-colors ${isActive('/login')
                    ? 'bg-green-100 text-green-700'
                    : 'text-green-600 hover:bg-green-50'
                    }`}
                >
                  <ArrowLeftEndOnRectangleIcon className="w-5 h-5 mr-2" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* BurgerMenu */}
            <BurgerMenu
              isOpen={isMenuOpen}
              onToggle={toggleMenu}
              onClose={closeMenu}
              user={user}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <Outlet />
      </main>
    </div>
  );
}