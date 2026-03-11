import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../services/hooks/useEvents';
import { useAuth } from '../services/hooks/useAuth';
import type { Event } from '../services/events/events.types';
import {
  CalendarIcon, MapPinIcon,
  UserGroupIcon, MagnifyingGlassIcon,
  FunnelIcon, ClockIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import { JoinButton, LeaveButton, FullButton, DisabledButton, EndedButton } from '../components/ui/Button';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import { formatEventListItem } from '../utils/formatDate';

export default function EventsList() {
  const { events, isLoading, error, fetchPublicEvents, joinEvent, leaveEvent } = useEvents();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    date: '',
  });

  const isEventPassed = (eventDateTime: string) => {
    return new Date(eventDateTime) < new Date();
  };

  useEffect(() => {
    fetchPublicEvents();
  }, [fetchPublicEvents]);

  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];

    return events.filter((event: Event) => {
      const matchesSearch =
        (event.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (event.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      const matchesLocation = !filters.location ||
        (event.location?.toLowerCase() || '').includes(filters.location.toLowerCase());

      const matchesDate = !filters.date ||
        (event.dateTime && new Date(event.dateTime).toISOString().split('T')[0] === filters.date);

      return matchesSearch && matchesLocation && matchesDate;
    });
  }, [events, searchTerm, filters]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ location: '', date: '' });
    setShowFilters(false);
  };

  if (isLoading) return <LoadingState message="Loading events..." fullScreen />;
  if (error) return <ErrorState message={error} fullScreen onRetry={fetchPublicEvents} />

  return (
    <div className="py-3 sm:py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className='flex flex-col gap-2'>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              Discover Events
            </h1>
            <p className="ml-2 text-xs sm:text-sm font-normal text-gray-500">
              Find and join exciting happening around you
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative w-full sm:w-auto sm:min-w-62.5 md:min-w-70">
              <MagnifyingGlassIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2
                w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-9 md:pl-10 pr-7 py-1.5 sm:py-2 
                  text-xs sm:text-sm md:text-base border
                  border-gray-300 rounded-lg focus:outline-none focus:ring-2
                  focus:ring-green-500 focus:border-transparent bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <XMarkIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 bg-white  border border-gray-300 rounded-lg sm:px-3 py-1.5
                  sm:py-0 flex items-center justify-center space-x-1.5 transition-colors text-xs sm:text-sm cursor-pointer
                  ${showFilters || filters.location || filters.date ? ' text-green-700 ' : ' text-gray-400 '}`}
            >
              <FunnelIcon className="mr-0 w-3.5 h-3.5 sm:w-6 sm:h-6" />
              <span className="hidden xs:inline">Filters</span>
              {(filters.location || filters.date) && (
                <span className="ml-1 bg-white text-green-600 rounded-full w-4 h-4 
                  flex items-center justify-center text-[8px] sm:text-[10px] font-bold">
                  {(filters.location ? 1 : 0) + (filters.date ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-xs text-green-600 hover:text-green-800"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Filter by location"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 
                  rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 
                  rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {filteredEvents.map((event: Event) => {
              const { date, time } = formatEventListItem(event.dateTime);

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100
                  overflow-hidden hover:shadow-md transition-all duration-300
                  flex flex-col h-full min-h-50 sm:min-h-60 md:min-h-70"
                >
                  {/* Content */}
                  <Link to={`/events/${event.id}`} className="block flex-1">
                    <div className="p-3 sm:p-4 md:p-5 h-full flex flex-col">
                      {/* Title */}
                      <h2 className="text-sm sm:text-base md:text-lg font-semibold
                        text-gray-900 transition-colors mb-1 line-clamp-2 h-10 sm:h-12">
                        {event.title}
                      </h2>

                      {/* Description */}
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2 leading-4 sm:leading-5 min-h-8 sm:min-h-10">
                        {event.description}
                      </p>

                      {/* Details */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-start">
                          <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 mt-0.5 shrink-0 text-gray-400" />
                          <span className="text-xs text-gray-600">{date}</span>
                        </div>

                        <div className="flex items-start">
                          <ClockIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 mt-0.5 shrink-0 text-gray-400" />
                          <span className="text-xs text-gray-600">{time}</span>
                        </div>

                        <div className="flex items-start">
                          <MapPinIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 mt-0.5 shrink-0 text-gray-400" />
                          <span className="text-xs text-gray-600 line-clamp-1">{event.location}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <UserGroupIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 shrink-0 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {event.participantsCount} / {event.capacity || '∞'} participants
                            </span>
                          </div>
                          {event.isFull && (
                            <span className="text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                              Full
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Action Button */}
                  <div className="px-3 pb-3 sm:px-4 sm:pb-4 md:px-5 md:pb-5 pt-0 mt-auto">
                    {event.organizerId === user?.id ? (
                      <DisabledButton fullWidth>
                        You are the organizer
                      </DisabledButton>
                    ) : event.isFull ? (
                      <FullButton fullWidth>
                        Event Full
                      </FullButton>
                    ) : event.userJoined ? (
                      isEventPassed(event.dateTime) ? (
                        <DisabledButton fullWidth>
                          Event Ended
                        </DisabledButton>
                      ) : (
                        <LeaveButton
                          fullWidth
                          onClick={(e) => {
                            e.preventDefault();
                            leaveEvent(event.id);
                          }}
                        >
                          Leave Event
                        </LeaveButton>
                      )
                    ) : (
                      isEventPassed(event.dateTime) ? (
                        <EndedButton fullWidth>
                          Event Ended
                        </EndedButton>
                      ) : (
                        <JoinButton
                          fullWidth
                          onClick={(e) => {
                            e.preventDefault();
                            joinEvent(event.id);
                          }}
                        >
                          Join Event
                        </JoinButton>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 md:py-16 bg-white rounded-lg sm:rounded-xl border border-gray-100">
            <div className="max-w-xs sm:max-w-sm mx-auto px-3 sm:px-4">
              <CalendarIcon className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto text-gray-400 mb-2 sm:mb-3" />
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1">
                {events.length === 0 ? 'No events available' : 'No matching events'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                {events.length === 0
                  ? 'No public events available at the moment'
                  : 'Try adjusting your search or filters'}
              </p>
              {(searchTerm || filters.location || filters.date) && (
                <button
                  onClick={clearFilters}
                  className="px-4 sm:px-5 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}